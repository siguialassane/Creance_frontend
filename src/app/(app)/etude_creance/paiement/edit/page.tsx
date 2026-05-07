"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { PaiementHistoriqueService } from "@/services/paiement-historique.service"
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
    montant: z.string().min(1, "Le montant est requis"),
    datePaiement: z.date({
        message: "La date de paiement est requise",
    }),
    modePaiement: z.string().min(1, "Le mode de paiement est requis"),
    typeEffet: z.string().optional(),
    numeroEffet: z.string().optional(),
    banqueAgence: z.string().optional(),
    dateEffet: z.date().optional(),
}).refine((data) => {
    if (data.typeEffet) {
        return !!data.numeroEffet && !!data.banqueAgence && !!data.dateEffet;
    }
    return true;
}, {
    message: "Veuillez remplir tous les détails de l'effet",
    path: ["numeroEffet"],
});

function EditPaiementPageInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const paiementId = searchParams.get('id')
    const creanceCode = searchParams.get('creanceCode')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedCreance, setSelectedCreance] = useState<any>(null)
    const [isEffetMode, setIsEffetMode] = useState(false)
    const apiClient = useApiClient()

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

    // Charger les données du paiement
    useEffect(() => {
        const loadPaiement = async () => {
            if (!paiementId) {
                toast.error("ID de paiement manquant")
                router.push("/paiements_des_creances/liste")
                return
            }

            try {
                let response;
                // Utiliser PaiementHistoriqueService comme dans la page liste
                if (creanceCode) {
                    response = await PaiementHistoriqueService.getAllByCreance(apiClient, creanceCode);
                    console.log('Paiements de la créance reçus (historique):', response);
                } else {
                    // Fallback sur PaiementService.getAll si pas de creanceCode
                    response = await PaiementService.getAll(apiClient);
                    console.log('Tous les paiements reçus:', response);
                }
                
                // Transformer les données selon la structure de réponse
                const data = response.data || response;
                const paiementsList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.content)
                        ? data.content
                        : Array.isArray(data.data)
                            ? data.data
                            : [];
                
                console.log('Liste des paiements:', paiementsList);
                console.log('Recherche paiement avec ID:', paiementId);
                console.log('Premier paiement structure:', paiementsList[0]);
                
                if (paiementsList.length > 0) {
                    const paiement = paiementsList.find((p: any) => 
                        p.IDENTIFIANT == paiementId || 
                        p.PAIE_CODE == paiementId ||
                        p.identifiant == paiementId || 
                        p.paieCode == paiementId
                    );
                    console.log('Données paiement trouvées (édition):', paiement);
                    
                    if (!paiement) {
                        toast.error("Paiement non trouvé")
                        router.push("/paiements_des_creances/liste")
                        return
                    }

                    // Transformer les données pour le formulaire
                    form.setValue('creanceCode', paiement.CREAN_CODE || paiement.creanceCode || '')
                    form.setValue('libelle', paiement.LIBELLE || paiement.libelle || 'Paiement facture')
                    form.setValue('montant', paiement.MONTANT?.toString() || paiement.montant?.toString() || '')
                    form.setValue('datePaiement', paiement.DATE_PAIE ? new Date(paiement.DATE_PAIE) : (paiement.datePaiement ? new Date(paiement.datePaiement) : new Date()))
                    form.setValue('modePaiement', paiement.MODE_PAIE_CODE || paiement.modePaiementCode || '')
                    
                    if (paiement.TYPE_EFET_CODE || paiement.typeEffetCode) {
                        form.setValue('typeEffet', paiement.TYPE_EFET_CODE || paiement.typeEffetCode)
                    }
                    if (paiement.NUMERO_EFFET || paiement.numeroEffet) {
                        form.setValue('numeroEffet', paiement.NUMERO_EFFET || paiement.numeroEffet)
                    }
                    if (paiement.BANQUE_AGENCE_CODE || paiement.banqueAgenceCode) {
                        form.setValue('banqueAgence', paiement.BANQUE_AGENCE_CODE || paiement.banqueAgenceCode)
                    }
                    if (paiement.DATE_EFFET || paiement.dateEffet) {
                        form.setValue('dateEffet', new Date(paiement.DATE_EFFET || paiement.dateEffet))
                    }
                    
                    // Sélectionner la créance
                    const creanceCodeValue = paiement.CREAN_CODE || paiement.creanceCode
                    if (creanceCodeValue) {
                        const creance = creancesQuery.items.find(i => i.value === creanceCodeValue)
                        if (creance) {
                            setSelectedCreance(creance)
                        }
                    }
                } else {
                    toast.error("Aucun paiement trouvé")
                    router.push("/paiements_des_creances/liste")
                }
            } catch (error: any) {
                console.error("Erreur lors du chargement du paiement:", error)
                toast.error(error.message || "Impossible de charger le paiement")
                router.push("/paiements_des_creances/liste")
            } finally {
                setLoading(false)
            }
        }

        loadPaiement()
    }, [paiementId, apiClient, router, form, creancesQuery.items])

    // Surveiller le mode de paiement pour afficher les champs effets
    const watchedModePaiement = form.watch("modePaiement")

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
            const payload: any = {};
            
            // Champs modifiables selon le backend
            if (values.libelle) payload.PAIE_LIB = values.libelle;
            if (values.montant) payload.PAIE_MONT = parseFloat(values.montant.replace(/\s/g, '').replace(',', '.'));
            if (values.datePaiement) payload.PAIE_DATEFT = formatDateForInput(values.datePaiement);
            if (values.numeroEffet) payload.EFFET_NUM = values.numeroEffet;
            if (values.banqueAgence) payload.BQAG_CODE = values.banqueAgence;

            console.log("Mise à jour du paiement:", payload)
            
            await PaiementService.update(apiClient, paiementId!, payload)

            toast.success("Paiement mis à jour avec succès")
            router.push("/paiements_des_creances/liste")
        } catch (error: any) {
            console.error("Erreur lors de la mise à jour:", error)
            toast.error(error.message || "Erreur lors de la mise à jour du paiement")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-6 max-w-3xl flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-600">Modifier un paiement</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

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
                                            onSearchChange={creancesQuery.setSearch}
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
                                            onSearchChange={modesPaiementQuery.setSearch}
                                            isLoading={modesPaiementQuery.isLoading}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                                        onSearchChange={typeEffetsQuery.setSearch}
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
                                                        onSearchChange={agencesBanqueQuery.setSearch}
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
                                    Mettre à jour le paiement
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function EditPaiementPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <EditPaiementPageInner />
        </Suspense>
    )
}
