"use client"

import { Grid, GridItem } from "@chakra-ui/react"
import SideBarMenu from "../sidebar-menu/sidebar-menu"
import { ReactNode } from "react"



interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
            <Grid templateColumns='20% 1fr' gap={0}>
            <GridItem>
                <SideBarMenu />
            </GridItem>
            <GridItem>
                {children}
            </GridItem>
        </Grid>
    )
}

export default MainLayout
