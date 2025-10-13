"use client"

import styled, { keyframes } from "styled-components"
import { Box, Stack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { logo } from "../../lib/theme/assets";
import MenuItemComponent from "../menu-item/menu-item-dynamic";
import { menuItems } from "../../lib/configs/menu.data";
import colors from "../../lib/theme/colors";
import { MenuItem } from "../../lib/types/menu";

const StyledSideBarMenu = styled.div`
  padding: 20px 0 18px 0px;
  height: 100vh;
  background: linear-gradient(180deg, ${colors.darkGreen} 0%, #0E3B2A 100%);
  overflow-y: auto;
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
`;

const SideBarMenu = () => {
    const pathname = usePathname();
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
            console.log('Menu actif détecté:', currentMenu.name, 'ID:', currentMenu.id, 'URL:', pathname);
        } else {
            console.log('Aucun menu trouvé pour URL:', pathname);
        }
    }, [pathname, isClient]);

    const handleChangeCurrentItem = (menu: MenuItem) => {
        if (currentSideBarMenuId === menu.id) {
            // Si on clique sur le même menu, on inverse l'état de fermeture
            setIsClose(!isClose);
        } else {
            // Si on clique sur un menu différent, on ouvre le nouveau
            setIsClose(false);
            setCurrentItem(menu.id);
        }
    }

    // Éviter le rendu initial jusqu'à ce que le client soit prêt
    if (!isClient) {
        return (
            <StyledSideBarMenu>
                <StyledImage>
                    <Image src={logo.src} w={100} mx="auto" />
                </StyledImage>
                <Box h="48px" />
                <Stack direction="column" style={{
                    flex: 1, overflowY:"auto", overflowX:"hidden", position: 'relative', zIndex: 2
                }} gap={2}>
                    {menuItems.map((mItem) => (
                        <MenuItemComponent 
                            key={mItem.id}
                            isClose={isClose} 
                            onPressed={handleChangeCurrentItem} 
                            menu={mItem} 
                            isSelected={false} // Pas de sélection initiale
                        />
                    ))}
                </Stack>
            </StyledSideBarMenu>
        );
    }

    return (        
        <StyledSideBarMenu>
            <StyledImage>
                <Image src={logo.src} w={100} mx="auto" />
            </StyledImage>
            <Box h="48px" />
            <Stack direction="column" style={{
                flex: 1, overflowY:"auto", overflowX:"hidden", position: 'relative', zIndex: 2
            }} gap={2}>
                {
                    menuItems.map((mItem) => (
                        <MenuItemComponent 
                            key={mItem.id}
                            isClose={isClose} 
                            onPressed={handleChangeCurrentItem} 
                            menu={mItem} 
                            isSelected={currentSideBarMenuId === mItem.id} 
                        />
                    ))
                }
            </Stack>
        </StyledSideBarMenu>
    )
}

export default SideBarMenu
