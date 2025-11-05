"use client"

import styled, { keyframes } from "styled-components"
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logo } from "@/lib/theme/assets";
import MenuItemComponent from "../menu-item/menu-item-dynamic";
import { menuItems } from "@/lib/configs/menu.data";
import colors from "@/lib/theme/colors";
import { MenuItem } from "@/lib/types/menu";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const StyledSideBarMenu = styled.div`
  padding: 20px 0 18px 0px;
  height: 100%;
  background: ${colors.darkGreen};
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%);
    pointer-events: none;
  }
`;

const StyledNavigation = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  z-index: 2;
  padding-bottom: 20px;
  
  /* Masquer le scrollbar pour WebKit (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* Masquer le scrollbar pour Firefox */
  scrollbar-width: none;
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
`;

const scaleLogo = keyframes`
    0% {
        transition: scale(1);
        rotate: 0deg;
    }
    50% {
        transform: scale(1.2);
    }
    60%{
        rotate: 10deg;
    }
    100%{
        rotate: 0deg;
        transition: scale(1);
    }
`

const StyledImage = styled.div`
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1.2);
    animation: ${scaleLogo} 8s infinite ease-in-out;
    width: 100%;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    z-index: 2;

    &:hover {
        transform: scale(1.25);
        transition: transform 0.3s ease;
    }

    img {
        width: 100px;
        height: auto;
        object-fit: contain;
    }
`;

const StyledStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const StyledSpacer = styled.div`
    height: 48px;
`;

const StyledToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -8px;
  width: 36px;
  height: 36px;
  background: ${colors.green};
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 111;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: ${colors.green};
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

export default function Sidebar({ isOpen = true, onClose, className, isCollapsed = false, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentSideBarMenuId, setCurrentItem] = useState<number>(0);
    const [isClose, setIsClose] = useState<boolean>(false);
    const [isClient, setIsClient] = useState(false);

    // Éviter l'hydratation en attendant que le client soit prêt
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Détecter automatiquement le menu actif selon l'URL
    useEffect(() => {
        if (!isClient || !pathname) return;

        // Trouver le menu correspondant à l'URL actuelle
        const currentMenu = menuItems.find(menu => {
            // Vérifier si l'URL correspond au menu principal
            if (menu.path === pathname) {
                return true;
            }
            // Vérifier si l'URL correspond à un sous-menu
            if (menu.subMenus) {
                return menu.subMenus.some(subMenu => {
                    // Construire le chemin du sous-menu
                    const subMenuPath = `${menu.path}/${subMenu.path}`;
                    return pathname === subMenuPath;
                });
            }
            return false;
        });

        if (currentMenu) {
            setCurrentItem(currentMenu.id);
            setIsClose(false); // S'assurer que le menu est ouvert quand on détecte une correspondance
        }
    }, [pathname, isClient]);

    const handleChangeCurrentItem = (menu: MenuItem) => {
        // Si c'est le menu Paramètres, rediriger directement
        if (menu.path === '/settings') {
            // Client-side navigation to avoid full reload
            router.push('/settings')
            if (onClose) {
                onClose();
            }
            return;
        }

        // Si le menu a un chemin et pas de sous-menus, naviguer
        if (menu.path && (!menu.subMenus || menu.subMenus.length === 0)) {
            router.push(menu.path)
            if (onClose) {
                onClose();
            }
            return;
        }

        if (currentSideBarMenuId === menu.id) {
            // Si on clique sur le même menu, on inverse l'état de fermeture
            setIsClose(!isClose);
        } else {
            // Si on clique sur un menu différent, on ouvre le nouveau
            setIsClose(false);
            setCurrentItem(menu.id);
        }
        
        // Fermer la sidebar sur mobile après sélection
        if (onClose) {
            onClose();
        }
    }

    // Éviter le rendu initial jusqu'à ce que le client soit prêt
    if (!isClient) {
        return (
            <StyledSideBarMenu className={className}>
                <StyledToggleButton onClick={onToggleCollapse || (() => {})} title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}>
                    {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </StyledToggleButton>
                {!isCollapsed && (
                    <StyledImage>
                        <Image src={logo.src} alt="Logo" width={100} height={100} />
                    </StyledImage>
                )}
                {isCollapsed && (
                    <StyledImage>
                        <Image src={logo.src} alt="Logo" width={40} height={40} />
                    </StyledImage>
                )}
                <StyledSpacer />
            <StyledNavigation>
                <StyledStack>
                    {menuItems.map((mItem) => (
                        <MenuItemComponent
                            key={mItem.id}
                            isClose={isClose}
                            onPressed={handleChangeCurrentItem}
                            menu={mItem}
                            isSelected={false} // Pas de sélection initiale
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </StyledStack>
            </StyledNavigation>
            </StyledSideBarMenu>
        );
    }

    return (
        <StyledSideBarMenu className={className}>
            <StyledToggleButton onClick={onToggleCollapse} title={isCollapsed ? "Agrandir le menu" : "Réduire le menu"}>
                {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </StyledToggleButton>
            {!isCollapsed && (
                <StyledImage>
                    <Image src={logo.src} alt="Logo" width={100} height={100} />
                </StyledImage>
            )}
            {isCollapsed && (
                <StyledImage>
                    <Image src={logo.src} alt="Logo" width={40} height={40} />
                </StyledImage>
            )}
            <StyledSpacer />
            <StyledNavigation>
                <StyledStack>
                    {
                        menuItems.map((mItem) => (
                            <MenuItemComponent
                                key={mItem.id}
                                isClose={isClose}
                                onPressed={handleChangeCurrentItem}
                                menu={mItem}
                                isSelected={currentSideBarMenuId === mItem.id}
                                isCollapsed={isCollapsed}
                            />
                        ))
                    }
                </StyledStack>
            </StyledNavigation>
        </StyledSideBarMenu>
    )
}
