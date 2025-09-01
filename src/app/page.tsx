import { Box, Text, VStack } from "@chakra-ui/react";
import colors from "@/lib/theme/colors";

export default function Home() {
  return (
    <Box 
      bg={colors.background} 
      minH="100vh" 
      p={8}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap={6} textAlign="center">
        <Text fontSize="4xl" fontWeight="bold" color={colors.darkGreen}>
          Bienvenue dans Appli-Trésor
        </Text>
        <Text fontSize="xl" color={colors.lightGray} maxW="600px">
          Application de gestion de trésor - Interface modernisée avec Next.js, 
          Tailwind CSS, Shadcn/ui, React Query et Axios
        </Text>
        <Box 
          bg={colors.white} 
          p={6} 
          borderRadius="lg" 
          boxShadow="lg"
          maxW="500px"
        >
          <Text fontSize="lg" color={colors.black} mb={4}>
            Fonctionnalités disponibles :
          </Text>
          <VStack gap={2} align="start">
            <Text color={colors.green}>✓ Gestion des paramètres</Text>
            <Text color={colors.green}>✓ Étude de créance</Text>
            <Text color={colors.green}>✓ Suivi clientèle</Text>
            <Text color={colors.green}>✓ Suivi recouvrement</Text>
            <Text color={colors.green}>✓ Contentieux</Text>
            <Text color={colors.green}>✓ Patrimoine</Text>
            <Text color={colors.green}>✓ Opérations diverses</Text>
            <Text color={colors.green}>✓ États et rapports</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
