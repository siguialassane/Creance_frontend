import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"
import colors from "../../lib/theme/colors"
import { StyledMenuItem } from "../../lib/theme/typography"
import { SubMenuItem } from "../../lib/types/menu"
import styled from "styled-components"

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

const NestedContainer = styled.div`
  margin-left: 12px;
  padding-left: 10px;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
`

const ExpandIcon = styled.div<{ $isOpen: boolean }>`
  margin-left: auto;
  color: #fff;
  font-size: 11px;
  transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`

function buildSubMenuHref(parentPath: string, subMenuPath: string) {
    if (subMenuPath === "") {
        return parentPath
    }

    if (subMenuPath.startsWith("/")) {
        return subMenuPath
    }

    return `${parentPath}/${subMenuPath}`
}

function buildSubMenuKey(parentPath: string, subMenu: SubMenuItem, siblingIndex: number) {
    const subMenuPath = subMenu.path?.toString().trim() || ""
    const href = buildSubMenuHref(parentPath, subMenuPath)
    const idPart = subMenu.id != null ? String(subMenu.id) : "no-id"
    const namePart = subMenu.name?.trim() || "no-name"

    return `${href}::${idPart}::${namePart}::${siblingIndex}`
}

function hasActiveChild(subMenu: SubMenuItem, parentPath: string, pathname: string): boolean {
    const currentHref = buildSubMenuHref(parentPath, subMenu.path?.toString().trim() || "")

    if (pathname === currentHref) {
        return true
    }

    if (!subMenu.subMenus?.length) {
        return false
    }

    return subMenu.subMenus.some((child) => hasActiveChild(child, currentHref, pathname))
}

const SubMenuItemComponent = ({ subMenu, isSelected, onPressed, parrentPath }: SubMenuItemProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const pathname = usePathname()

    // Si le path est vide ou null/undefined, utiliser seulement le path parent
    // Si le path commence par /, c'est un path absolu, l'utiliser tel quel
    const subMenuPath = subMenu.path?.toString().trim() || ""
    const href = useMemo(() => buildSubMenuHref(parrentPath, subMenuPath), [parrentPath, subMenuPath])
    const childIsActive = useMemo(() => hasActiveChild(subMenu, parrentPath, pathname), [subMenu, parrentPath, pathname])
    const [isExpanded, setIsExpanded] = useState(childIsActive)

    useEffect(() => {
        if (childIsActive) {
            setIsExpanded(true)
        }
    }, [childIsActive])

    const currentIsSelected = isSelected || childIsActive

    if (subMenu.subMenus?.length) {
        return (
            <div>
                <BorderedStyle
                    $isSelected={currentIsSelected}
                    $isHovered={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => {
                        setIsExpanded((previous) => !previous)
                        onPressed(subMenu)
                    }}
                >
                    <StyledMenuItem $textColor={currentIsSelected ? '#FFFFFF' : isHovered ? '#E5E7EB' : colors.lightGray}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                            <SubMenuNameStyled>{subMenu.name}</SubMenuNameStyled>
                            <ExpandIcon $isOpen={isExpanded}>▶</ExpandIcon>
                        </div>
                    </StyledMenuItem>
                </BorderedStyle>

                {isExpanded && (
                    <NestedContainer>
                        {subMenu.subMenus.map((child, index) => (
                            <SubMenuItemComponent
                                key={buildSubMenuKey(href, child, index)}
                                parrentPath={href}
                                onPressed={onPressed}
                                isSelected={pathname === buildSubMenuHref(href, child.path?.toString().trim() || "")}
                                subMenu={child}
                                hasLeftIndicator={false}
                            />
                        ))}
                    </NestedContainer>
                )}
            </div>
        )
    }

    return (
        (
            <Link href={href} onClick={() => parrentPath !== '/settings' && onPressed(subMenu)}>
                <BorderedStyle 
                    $isSelected={currentIsSelected} 
                    $isHovered={isHovered}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <StyledMenuItem $textColor={currentIsSelected ? '#FFFFFF' : isHovered ? '#E5E7EB' : colors.lightGray}>

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
