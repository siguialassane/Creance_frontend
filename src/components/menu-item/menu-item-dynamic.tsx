"use client"

import { Box, Image, Stack, Text } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { MenuItem, SubMenuItem } from '../../lib/types/menu'
import colors from '../../lib/theme/colors'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SubMenuItemComponent from './sub-menu-item'

interface MenuItemProps {
    menu: MenuItem
    isSelected: boolean
    isClose: boolean
    onPressed: (mn: MenuItem) => void
}

const MenuItemComponent = ({ menu, isSelected, onPressed, isClose }: MenuItemProps) => {
    const [subMenuItem, setSubMenuItem] = useState<number>()
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (menu.subMenus) {
            let currentMenu: any = menu.subMenus.find((subMenu) => window.location.pathname.includes(encodeURI(subMenu.path)))
            if (currentMenu) {
                setSubMenuItem(() => currentMenu.id)
            }
        }
    }, [])

    const handleMenuClick = (subMenu: SubMenuItem) => {
        setSubMenuItem((_) => subMenu.id)
    }

    // Styles professionnels et dynamiques
    const menuItemStyle = {
        padding: '14px 20px',
        backgroundColor: isSelected 
            ? 'rgba(34, 197, 94, 0.2)' 
            : isHovered 
                ? 'rgba(255, 255, 255, 0.08)' 
                : 'transparent',
        color: isSelected ? colors.green : isHovered ? '#E5E7EB' : '#9CA3AF',
        cursor: 'pointer',
        borderRadius: '8px',
        margin: '2px 12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isSelected 
            ? `1px solid ${colors.green}` 
            : '1px solid transparent',
        boxShadow: isSelected 
            ? '0 4px 12px rgba(46, 160, 67, 0.3)' 
            : isHovered 
                ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                : 'none',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: isSelected ? '600' : '500',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0px)'
    }

    const subMenuContainerStyle = {
        marginLeft: '16px',
        marginTop: '8px',
        marginBottom: '8px',
        overflow: 'hidden',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        padding: '12px 8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative' as const
    }



    const iconStyle = {
        width: '22px',
        height: '22px',
        filter: isSelected ? 'brightness(1.3) saturate(1.2)' : isHovered ? 'brightness(1.1)' : 'brightness(0.9)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
    }

    return (
        <div>
            <div 
                onClick={() => onPressed(menu)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                                <motion.div
                    style={menuItemStyle}
                    whileHover={{ 
                        scale: 1.02,
                        y: -1
                    }}
                    whileTap={{ 
                        scale: 0.98,
                        y: 0
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Effet de brillance au survol */}
                    {isHovered && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                zIndex: 1
                            }}
                            animate={{ left: '100%' }}
                            transition={{ duration: 0.6 }}
                        />
                    )}

                    {/* Indicateur de sélection */}
                    {isSelected && (
                        <motion.div
                            style={{
                                position: 'absolute',
                                left: '0',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '4px',
                                height: '24px',
                                backgroundColor: colors.green,
                                borderRadius: '0 2px 2px 0',
                                boxShadow: `0 0 8px ${colors.green}`
                            }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                    )}
                    
                    {/* Icône avec animation */}
                    <motion.div
                        style={{
                            width: '22px',
                            height: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 2
                        }}
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image 
                            src={typeof menu.icon === 'string' ? menu.icon : menu.icon?.src} 
                            alt={menu.name}
                            style={iconStyle}
                        />
                    </motion.div>
                    
                    {/* Texte du menu avec animation */}
                    <motion.span
                        style={{
                            flex: 1,
                            fontSize: '14px',
                            fontWeight: isSelected ? '600' : '500',
                            color: isSelected ? colors.green : isHovered ? '#E5E7EB' : '#9CA3AF',
                            position: 'relative',
                            zIndex: 2
                        }}
                        animate={{
                            color: isSelected ? colors.green : isHovered ? '#E5E7EB' : '#9CA3AF'
                        }}
                        transition={{ duration: 0.2 }}
                    >
                        {menu.name}
                    </motion.span>
                    
                    {/* Flèche pour les sous-menus avec animation */}
                    {menu.subMenus && (
                        <motion.div
                            style={{
                                color: isSelected ? colors.green : isHovered ? '#E5E7EB' : '#9CA3AF',
                                fontSize: '12px',
                                position: 'relative',
                                zIndex: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                                transition: 'background-color 0.2s ease',
                                marginLeft: '8px'
                            }}
                            animate={{
                                rotate: isSelected && !isClose ? 90 : 0,
                                color: isSelected ? colors.green : isHovered ? '#E5E7EB' : '#9CA3AF'
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            whileHover={{ scale: 1.1 }}
                        >
                            ▶
                        </motion.div>
                    )}
            </motion.div>
            </div>

            {/* Sous-menus avec animation */}
            {menu.subMenus && (
                <AnimatePresence>
                    {isSelected && !isClose && (
                        <motion.div
                            style={subMenuContainerStyle}
                            initial={{ height: 0, opacity: 0, scale: 0.95 }}
                            animate={{ height: 'auto', opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.95 }}
                            transition={{ 
                                duration: 0.4, 
                                ease: "easeInOut",
                                staggerChildren: 0.1
                            }}
                        >
                            {menu.subMenus.map((subMenu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ x: -30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ 
                                        delay: index * 0.1, 
                                        duration: 0.4,
                                        ease: "easeOut"
                                    }}
                                >
                                    <SubMenuItemComponent 
                                        key={index}
                                        parrentPath={menu.path} 
                                        onPressed={handleMenuClick} 
                                        isSelected={subMenuItem === subMenu.id} 
                                        subMenu={subMenu} 
                                        hasLeftIndicator={false}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    )
}

export default MenuItemComponent
