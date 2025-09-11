"use client"

import { useState, useEffect } from 'react'
import { Box, Stack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, useDisclosure } from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import colors from '../../lib/theme/colors'
import { SubMenuItem } from '../../lib/types/menu'

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
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

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
        onOpen()
    }

    const handleEdit = (item: DataItem) => {
        setEditingItem(item)
        setFormData({ code: item.code, libelle: item.libelle })
        onOpen()
    }

    const handleDelete = (id: string) => {
        setData(data.filter(item => item.id !== id))
        toast({
            title: 'Supprimé',
            description: 'Élément supprimé avec succès',
            status: 'success',
            duration: 3000,
        })
    }

    const handleSave = () => {
        if (editingItem) {
            // Modification
            setData(data.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData }
                    : item
            ))
            toast({
                title: 'Modifié',
                description: 'Élément modifié avec succès',
                status: 'success',
                duration: 3000,
            })
        } else {
            // Ajout
            const newItem: DataItem = {
                id: `new_${data.length + 1}`,
                ...formData
            }
            setData([...data, newItem])
            toast({
                title: 'Ajouté',
                description: 'Élément ajouté avec succès',
                status: 'success',
                duration: 3000,
            })
        }
        onClose()
    }

    return (
        <Box p={8} backgroundColor={colors.background} minH="100vh">
            <Stack spacing={6}>
                {/* En-tête */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Text fontSize="2xl" fontWeight="bold" color={colors.darkGreen}>
                        {title}
                    </Text>
                    <Button
                        leftIcon={<AddIcon color="white" />}
                        colorScheme="green"
                        onClick={handleAdd}
                        _hover={{ transform: 'translateY(-2px)' }}
                        transition="all 0.3s ease"
                    >
                        Ajouter
                    </Button>
                </Stack>

                {/* Barre de recherche */}
                <Box>
                    <Input
                        placeholder={`Rechercher dans ${subMenu.name}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        backgroundColor="white"
                        border={`2px solid ${colors.lightGray}`}
                        _focus={{ borderColor: colors.green }}
                        transition="all 0.3s ease"
                    />
                </Box>

                {/* Table */}
                <Box backgroundColor="white" borderRadius="12px" overflow="hidden" boxShadow="0 4px 15px rgba(0,0,0,0.1)">
                    <Table variant="simple">
                        <Thead backgroundColor={colors.lightGreen}>
                            <Tr>
                                <Th color={colors.darkGreen}>Code</Th>
                                <Th color={colors.darkGreen}>Libellé</Th>
                                <Th color={colors.darkGreen} textAlign="center">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredData.map((item) => (
                                <Tr key={item.id} _hover={{ backgroundColor: colors.lightGreen + '20' }}>
                                    <Td fontWeight="500">{item.code}</Td>
                                    <Td>{item.libelle}</Td>
                                    <Td textAlign="center">
                                        <Stack direction="row" spacing={2} justifyContent="center">
                                            <IconButton
                                                aria-label="Modifier"
                                                icon={<EditIcon />}
                                                size="sm"
                                                colorScheme="blue"
                                                onClick={() => handleEdit(item)}
                                                _hover={{ transform: 'scale(1.1)' }}
                                                transition="all 0.3s ease"
                                            />
                                            <IconButton
                                                aria-label="Supprimer"
                                                icon={<DeleteIcon />}
                                                size="sm"
                                                colorScheme="red"
                                                onClick={() => handleDelete(item.id)}
                                                _hover={{ transform: 'scale(1.1)' }}
                                                transition="all 0.3s ease"
                                            />
                                        </Stack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Stack>

            {/* Modal pour ajouter/modifier */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader color={colors.darkGreen}>
                        {editingItem ? 'Modifier' : 'Ajouter'} {subMenu.name}
                    </ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Code</FormLabel>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    border={`2px solid ${colors.lightGray}`}
                                    _focus={{ borderColor: colors.green }}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Libellé</FormLabel>
                                <Input
                                    value={formData.libelle}
                                    onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                                    border={`2px solid ${colors.lightGray}`}
                                    _focus={{ borderColor: colors.green }}
                                />
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Annuler
                        </Button>
                        <Button colorScheme="green" onClick={handleSave}>
                            {editingItem ? 'Modifier' : 'Ajouter'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
