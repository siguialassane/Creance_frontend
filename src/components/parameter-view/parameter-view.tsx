"use client"

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import colors from '../../lib/theme/colors'
import { SubMenuItem } from '../../lib/types/menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface ParameterViewProps {
    subMenu: SubMenuItem
    title: string
}

interface DataItem {
    id: string
    code: string
    libelle: string
    [key: string]: any
}

export default function ParameterView({ subMenu, title }: ParameterViewProps) {
    const [data, setData] = useState<DataItem[]>([])
    const [filteredData, setFilteredData] = useState<DataItem[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [editingItem, setEditingItem] = useState<DataItem | null>(null)
    const [formData, setFormData] = useState({ code: '', libelle: '' })
    const [isOpen, setIsOpen] = useState(false)

    // Données de démonstration basées sur le type de paramètre
    useEffect(() => {
        const demoData: DataItem[] = [
            { id: '1', code: '001', libelle: 'Exemple 1' },
            { id: '2', code: '002', libelle: 'Exemple 2' },
            { id: '3', code: '003', libelle: 'Exemple 3' },
        ]
        setData(demoData)
        setFilteredData(demoData)
    }, [])

    // Filtrage des données
    useEffect(() => {
        const filtered = data.filter(item =>
            item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.libelle.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(filtered)
    }, [searchTerm, data])

    const handleAdd = () => {
        setEditingItem(null)
        setFormData({ code: '', libelle: '' })
        setIsOpen(true)
    }

    const handleEdit = (item: DataItem) => {
        setEditingItem(item)
        setFormData({ code: item.code, libelle: item.libelle })
        setIsOpen(true)
    }

    const handleDelete = (id: string) => {
        setData(data.filter(item => item.id !== id))
        toast.success('Élément supprimé avec succès')
    }

    const handleSave = () => {
        if (editingItem) {
            // Modification
            setData(data.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData }
                    : item
            ))
            toast.success('Élément modifié avec succès')
        } else {
            // Ajout
            const newItem: DataItem = {
                id: `new_${data.length + 1}`,
                ...formData
            }
            setData([...data, newItem])
            toast.success('Élément ajouté avec succès')
        }
        setIsOpen(false)
    }

    return (
        <div className="p-8 min-h-screen" style={{ backgroundColor: colors.background }}>
            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
                        {title}
                    </h1>
                    <Button
                        onClick={handleAdd}
                        className="transition-transform hover:translate-y-[-2px]"
                        style={{ backgroundColor: colors.green }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter
                    </Button>
                </div>

                {/* Barre de recherche */}
                <div>
                    <Input
                        placeholder={`Rechercher dans ${subMenu.name}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white border-2 transition-colors"
                        style={{ borderColor: colors.lightGray }}
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <Table>
                        <TableHeader style={{ backgroundColor: colors.lightGreen }}>
                            <TableRow>
                                <TableHead style={{ color: colors.darkGreen }}>Code</TableHead>
                                <TableHead style={{ color: colors.darkGreen }}>Libellé</TableHead>
                                <TableHead className="text-center" style={{ color: colors.darkGreen }}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-opacity-20 transition-colors"
                                    style={{ '--hover-bg': colors.lightGreen } as React.CSSProperties}
                                >
                                    <TableCell className="font-medium">{item.code}</TableCell>
                                    <TableCell>{item.libelle}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(item)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="transition-transform hover:scale-110"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Dialog pour ajouter/modifier */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle style={{ color: colors.darkGreen }}>
                            {editingItem ? 'Modifier' : 'Ajouter'} {subMenu.name}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem ? 'Modifiez' : 'Ajoutez'} les informations ci-dessous.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Code</Label>
                            <Input
                                id="code"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="border-2"
                                style={{ borderColor: colors.lightGray }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="libelle">Libellé</Label>
                            <Input
                                id="libelle"
                                value={formData.libelle}
                                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                                className="border-2"
                                style={{ borderColor: colors.lightGray }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsOpen(false)}>
                            Annuler
                        </Button>
                        <Button onClick={handleSave} style={{ backgroundColor: colors.green }}>
                            {editingItem ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
