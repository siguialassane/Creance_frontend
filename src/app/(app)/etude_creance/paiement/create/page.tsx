"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { useApiClient } from "@/hooks/useApiClient"
import { PaiementService } from "@/services/paiement.service"
import { useCreancesSearchable } from "@/hooks/useCreancesSearchable"
import { useModesPaiementSearchable } from "@/hooks/useModesPaiementSearchable"
import { useTypeEffetsSearchable } from "@/hooks/useTypeEffetsSearchable"
import { useAgencesBanqueSearchable } from "@/hooks/useAgencesBanqueSearchable"

const formatDateForInput = (date?: Date) => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Schéma de validation
const formSchema = z.object({
    creanceCode: z.string().min(1, "Veuillez sélectionner une créance"),
    libelle: z.string().min(1, "Le libellé est requis"),
    montant: z.string().min(1, "Le montant est requis"), // On gère comme string pour l'input, converti ensuite
    datePaiement: z.date({
        required_error: "La date de paiement est requise",
    }),
    modePaiement: z.string().min(1, "Le mode de paiement est requis"),

    // Champs conditionnels pour les effets
    typeEffet: z.string().optional(),
    numeroEffet: z.string().optional(),
    banqueAgence: z.string().optional(),
    dateEffet: z.date().optional(),
}).refine((data) => {
    // Si mode paiement est un effet (on suppose que le code contient 'EFFET' ou 'CHQ' ou 'TRAITE' - à adapter selon les codes réels)
    // Pour l'instant on se base sur la présence de valeurs dans les champs effets si l'utilisateur les remplit
    // Ou mieux, on vérifie le code du mode de paiement sélectionné. 
    // Supposons que les modes nécessitant des détails d'effet sont connus ou que l'UI gère l'affichage.
    // Ici on valide que SI typeEffet est rempli, alors numeroEffet et banqueAgence le sont aussi
    if (data.typeEffet) {
        return !!data.numeroEffet && !!data.banqueAgence && !!data.dateEffet;
    }
    return true;
}, {
    message: "Veuillez remplir tous les détails de l'effet",
    path: ["numeroEffet"], // Pointer l'erreur sur un champ
});

export default function CreatePaiementPage() {
    const router = useRouter()
    const apiClient = useApiClient()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedCreance, setSelectedCreance] = useState<any>(null)
    const [isEffetMode, setIsEffetMode] = useState(false)

    // Hooks pour les données
    const creancesQuery = useCreancesSearchable()
    const modesPaiementQuery = useModesPaiementSearchable()
    const typeEffetsQuery = useTypeEffetsSearchable()
    const agencesBanqueQuery = useAgencesBanqueSearchable()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            libelle: "Paiement facture",
            datePaiement: new Date(),
            montant: "",
        },
    })

    // Surveiller le mode de paiement pour afficher les champs effets
    const watchedModePaiement = form.watch("modePaiement")

    // Logique pour déterminer si c'est un effet
    // On pourrait améliorer ça en vérifiant une propriété du mode de paiement si disponible
    // Pour l'instant, on considère que si le libellé contient "EFFET", "CHEQUE", "TRAITE", "VIREMENT" c'est un effet ?
    // Ou on demande à l'utilisateur via l'UI.
    // Le plus simple : Si le mode sélectionné correspond à un code spécifique.
    // D'après le doc : "Concernant les effets...".
    // On va supposer que certains codes déclenchent l'affichage.
    // Comme on ne connait pas les codes exacts, on va afficher les champs effets si le mode n'est PAS "ESPECES" (ESP) ?
    // Ou on regarde si le mode sélectionné a un libellé qui suggère un effet.
    if (watchedModePaiement && modesPaiementQuery.items.length > 0) {
        const selectedMode = modesPaiementQuery.items.find(m => m.value === watchedModePaiement);
        if (selectedMode) {
            const libelle = selectedMode.label.toLowerCase();
            const isEffet = libelle.includes("cheque") || libelle.includes("effet") || libelle.includes("traite") || libelle.includes("virement");
            if (isEffet !== isEffetMode) {
                setIsEffetMode(isEffet);
            }
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            // Préparer le payload
            const payload = {
                creanceCode: values.creanceCode,
                libelle: values.libelle,
                montant: parseFloat(values.montant.replace(/\s/g, '').replace(',', '.')), // Nettoyer le format
                datePaiement: formatDateForInput(values.datePaiement),
                modePaiement: values.modePaiement,
                utilisateur: "ADMIN", // TODO: Récupérer l'utilisateur connecté

                // Champs effets
                ...(isEffetMode && {
                    typeEffet: values.typeEffet,
                    numeroEffet: values.numeroEffet,
                    banqueAgence: values.banqueAgence,
                    dateEffet: values.dateEffet ? formatDateForInput(values.dateEffet) : undefined,
                })
            }

            console.log("Envoi du paiement:", payload)
            await PaiementService.create(apiClient, payload)

            toast.success("Paiement enregistré avec succès")
            router.push("/etude_creance/paiement") // Redirection vers la liste (à créer) ou retour
        } catch (error: any) {
            console.error("Erreur lors de l'enregistrement:", error)
            toast.error(error.message || "Erreur lors de l'enregistrement du paiement")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-600">Enregistrement d'un paiement</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Sélection de la créance */}
                            <FormField
                                control={form.control}
                                name="creanceCode"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Créance / Contrat</FormLabel>
                                        <SearchableSelect
                                            placeholder="Rechercher une créance (Code ou Débiteur)..."
                                            items={creancesQuery.items}
                                            value={field.value}
                                            onValueChange={(val) => {
                                                field.onChange(val)
                                                const creance = creancesQuery.items.find(i => i.value === val)
                                                setSelectedCreance(creance)
                                            }}
                                            onSearch={creancesQuery.setSearch}
                                            isLoading={creancesQuery.isLoading}
                                            hasMore={creancesQuery.hasMore}
                                            onLoadMore={creancesQuery.loadMore}
                                        />
                                        {selectedCreance && (
                                            <div className="text-sm text-gray-500 mt-1 p-2 bg-gray-50 rounded border">
                                                <p><strong>Débiteur:</strong> {selectedCreance.debiteurNom} {selectedCreance.debiteurPrenom}</p>
                                                <p><strong>Solde à recouvrer:</strong> {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(selectedCreance.soldeInit || 0)}</p>
                                            </div>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date de paiement */}
                                <FormField
                                    control={form.control}
                                    name="datePaiement"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date de paiement</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={formatDateForInput(field.value)}
                                                max={formatDateForInput(new Date())}
                                                min="1900-01-01"
                                                onChange={(event) => {
                                                    const value = event.target.value
                                                    field.onChange(value ? new Date(value) : undefined)
                                                }}
                                            />
                                        </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Montant */}
                                <FormField
                                    control={form.control}
                                    name="montant"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Montant</FormLabel>
                                            <FormControl>
                                                <Input placeholder="0" {...field} type="number" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Libellé */}
                            <FormField
                                control={form.control}
                                name="libelle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Libellé</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Libellé du paiement" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Mode de paiement */}
                            <FormField
                                control={form.control}
                                name="modePaiement"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Mode de paiement</FormLabel>
                                        <SearchableSelect
                                            placeholder="Sélectionner un mode..."
                                            items={modesPaiementQuery.items}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            onSearch={modesPaiementQuery.setSearch}
                                            isLoading={modesPaiementQuery.isLoading}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Section Effets (Conditionnelle) */}
                            {isEffetMode && (
                                <div className="border rounded-md p-4 bg-gray-50 space-y-4">
                                    <h3 className="font-semibold text-gray-700">Détails de l'effet</h3>
                                    <Separator />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="typeEffet"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Type d'effet</FormLabel>
                                                    <SearchableSelect
                                                        placeholder="Sélectionner un type..."
                                                        items={typeEffetsQuery.items}
                                                        value={field.value || ""}
                                                        onValueChange={field.onChange}
                                                        onSearch={typeEffetsQuery.setSearch}
                                                        isLoading={typeEffetsQuery.isLoading}
                                                        hasMore={typeEffetsQuery.hasMore}
                                                        onLoadMore={typeEffetsQuery.loadMore}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="numeroEffet"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Numéro de l'effet</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="N° chèque / effet" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="banqueAgence"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Banque / Agence</FormLabel>
                                                    <SearchableSelect
                                                        placeholder="Sélectionner une agence..."
                                                        items={agencesBanqueQuery.items}
                                                        value={field.value || ""}
                                                        onValueChange={field.onChange}
                                                        onSearch={agencesBanqueQuery.setSearch}
                                                        isLoading={agencesBanqueQuery.isLoading}
                                                        hasMore={agencesBanqueQuery.hasMore}
                                                        onLoadMore={agencesBanqueQuery.loadMore}
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="dateEffet"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Date de l'effet</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                value={formatDateForInput(field.value)}
                                                onChange={(event) => {
                                                    const value = event.target.value
                                                    field.onChange(value ? new Date(value) : undefined)
                                                }}
                                            />
                                        </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="outline" type="button" onClick={() => router.back()}>
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Enregistrer le paiement
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
