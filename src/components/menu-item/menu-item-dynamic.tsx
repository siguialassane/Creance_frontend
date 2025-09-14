"use client"

import { Box, Image, Stack, Text } from '@chakra-ui/react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { MenuItem, SubMenuItem } from '../../lib/types/menu'
import colors from '../../lib/theme/colors'
import { useState, useEffect } from 'react'
import SubMenuItemComponent from './sub-menu-item'
import { Icon } from '@iconify/react'

interface MenuItemProps {
    menu: MenuItem
    isSelected: boolean
    isClose: boolean
    onPressed: (mn: MenuItem) => void
}

const MenuItemComponent = ({ menu, isSelected, onPressed, isClose }: MenuItemProps) => {
    const [subMenuItem, setSubMenuItem] = useState<number>()

    useEffect(() => {
        if (menu.subMenus) {
            const pathname = window.location.pathname
            let currentMenu: any = menu.subMenus.find((subMenu) => pathname.includes(encodeURI(subMenu.path)))
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
        // backgroundColor: isSelected 
        //     ? 'rgba(34, 197, 94, 0.15)' 
        //     : 'transparent',
        color: isSelected ? colors.green : '#9CA3AF',
        cursor: 'pointer',
        borderRadius: '8px',
        margin: '2px 12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: isSelected 
            ? `1px solid ${colors.green}` 
            : '1px solid transparent',
        // boxShadow: isSelected 
        //     ? '0 4px 12px rgba(34, 197, 94, 0.2)' 
        //     : 'none',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        fontWeight: isSelected ? '600' : '500'
    }

    const subMenuContainerStyle = {
        marginLeft: '16px',
        marginTop: '8px',
        marginBottom: '8px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(10px)',
        padding: '8px 6px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative' as const
        
    }



    const iconStyle = {
        width: '22px',
        height: '22px',
        filter: isSelected ? 'brightness(1.3) saturate(1.2)' : 'brightness(0.9)'
        
    }

    return (
        <div>
            <div 
                onClick={() => onPressed(menu)}
                style={menuItemStyle}
            >
                {/* Indicateur de sélection */}
                {isSelected && (
                    <div
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
                    />
                )}
                
                {/* Icône */}
                <div
                    style={{
                        width: '22px',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2
                    }}
                >
                    <Image 
                        src={typeof menu.icon === 'string' ? menu.icon : menu.icon?.src} 
                        alt={menu.name}
                        style={iconStyle}
                    />
                </div>
                
                {/* Texte du menu */}
                <span
                    style={{
                        flex: 1,
                        fontSize: '14px',
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? colors.green : '#fff',
                        position: 'relative',
                        zIndex: 2
                    }}
                >
                    {menu.name}
                </span>
                
                {/* Flèche pour les sous-menus */}
                {menu.path !== '/settings' && menu.subMenus && (
                    <div
                        style={{
                            color: isSelected ? colors.green : '#fff',
                            fontSize: '12px',
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            transform: isSelected && !isClose ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                        }}
                    >
                        <Icon icon={"mdi:chevron-right"} 
                        width={20}
                        height={20}
                        color={isSelected ? colors.green : '#fff'}
                        />
                    </div>
                )}
            </div>

            {/* Sous-menus */}
            {menu.path !== '/settings' && menu.subMenus && isSelected && !isClose && (
                <div style={subMenuContainerStyle}>
                    {menu.subMenus.map((subMenu, index) => (
                        <SubMenuItemComponent 
                            key={index}
                            parrentPath={menu.path} 
                            onPressed={handleMenuClick} 
                            isSelected={subMenuItem === subMenu.id} 
                            subMenu={subMenu} 
                            hasLeftIndicator={false}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MenuItemComponent
