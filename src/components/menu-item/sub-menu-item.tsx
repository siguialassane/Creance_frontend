import Link from "next/link"
import { useState } from "react"
import colors from "../../lib/theme/colors"
import { StyledMenuItem } from "../../lib/theme/typography"
import { SubMenuItem } from "../../lib/types/menu"
import styled, { keyframes } from "styled-components"

type SubMenuItemProps = {
    subMenu: SubMenuItem,
    isSelected: boolean
    hasLeftIndicator?: boolean
    onPressed: (e: SubMenuItem) => void
    parrentPath: string
}

const BorderedStyle = styled.div<{ $isSelected: boolean; $isHovered: boolean }>`
overflow-x: hidden;
max-width: 100%;
padding-right: 1rem;
padding-left: 1rem;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
background-color: ${props => props.$isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent'};
border-radius: 8px;
display: block;
cursor: pointer;
border: none; /* pas de cadre rectangulaire autour de l'élément sélectionné */
// box-shadow: ${props => props.$isSelected ? '0 2px 8px rgba(255, 255, 255, 0.2)' : 'none'};
transform: ${props => props.$isHovered ? 'translateX(4px)' : 'translateX(0px)'};
position: relative;
margin: 0.5rem 0;

&:hover {
    background-color: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
    border-color: transparent;
}

&:last-child {
    margin-bottom: 0;
}
`

const SubMenuNameStyled = styled.div`
  scrollbar-width: none;
  overflow-y: scroll;
  transition: color 0.2s ease-in-out;
  font-size: 16px;
  color: #fff;
  font-weight: 500;
`

const AnimatedSubIcon = styled.div<{ $isSelected: boolean; $isHovered?: boolean }>`
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$isSelected ? 'scale(1.1)' : props.$isHovered ? 'scale(1.05)' : 'scale(1)'};
  color: ${props => props.$isSelected ? '#FFFFFF' : props.$isHovered ? '#E5E7EB' : '#fff'};
  font-size: 12px;
  filter: ${props => props.$isSelected ? 'brightness(1.2)' : 'brightness(1)'};
`

const SubMenuItemComponent = ({ subMenu, isSelected, onPressed, hasLeftIndicator, parrentPath }: SubMenuItemProps) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        (
            <Link href={parrentPath+'/'+subMenu.path.toString()} onClick={() => parrentPath !== '/settings' && onPressed(subMenu)}>
                <BorderedStyle 
                    $isSelected={isSelected} 
                    $isHovered={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <StyledMenuItem $textColor={isSelected ? '#FFFFFF' : isHovered ? '#E5E7EB' : colors.lightGray}>

                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', justifyContent: 'flex-start', alignItems: 'center' }}>
                            {/* <AnimatedSubIcon $isSelected={isSelected} $isHovered={isHovered}>
                                {isSelected ? '▶' : '•'}
                            </AnimatedSubIcon> */}
                            <SubMenuNameStyled>{subMenu.name}</SubMenuNameStyled>
                        </div>

                    </StyledMenuItem>
                </BorderedStyle>
            </Link>
        )
    )
}

export default SubMenuItemComponent
