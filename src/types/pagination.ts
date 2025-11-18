// Types pour la pagination et la réponse API

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sortDirection?: 'ASC' | 'DESC';
  sortBy?: string;
  // Filtres pour créances
  statutRecouvrement?: string;
  groupeCreance?: string;
  dateCreationFrom?: string;
  dateCreationTo?: string;
  dateEcheanceFrom?: string;
  dateEcheanceTo?: string;
  typeDebiteur?: 'P' | 'M';
  // Filtres pour débiteurs
  categorieDebiteur?: string;
  quartier?: string;
  ville?: string;
  statutSalarie?: string;
}

export interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  numberOfElements: number;
}

export interface ApiResponse<T> {
  data: {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
    numberOfElements: number;
  };
  message: string;
  status: 'SUCCESS' | 'ERROR';
  timestamp: string;
}

export interface PaginatedData<T> {
  content: T[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}

// Fonction utilitaire pour valider et normaliser les paramètres de pagination
export function normalizePaginationParams(params: PaginationParams): PaginationParams {
  const normalized: PaginationParams = {};

  // Page validation
  if (params.page !== undefined) {
    normalized.page = Math.max(0, params.page);
  }

  // Size validation
  if (params.size !== undefined) {
    normalized.size = Math.min(100, Math.max(1, params.size));
  } else {
    normalized.size = 50; // Default size
  }

  // Search validation
  if (params.search !== undefined && params.search.trim() !== '') {
    normalized.search = params.search.trim();
  }

  // Sort direction validation
  if (params.sortDirection && ['ASC', 'DESC'].includes(params.sortDirection)) {
    normalized.sortDirection = params.sortDirection;
  } else {
    normalized.sortDirection = 'ASC';
  }

  // Sort by validation
  if (params.sortBy && params.sortBy.trim() !== '') {
    normalized.sortBy = params.sortBy.trim();
  }

  return normalized;
}

// Fonction pour construire les paramètres de requête
export function buildQueryParams(params: PaginationParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.append('page', params.page.toString());
  }

  if (params.size !== undefined) {
    searchParams.append('size', params.size.toString());
  }

  if (params.search) {
    searchParams.append('search', params.search);
  }

  if (params.sortDirection) {
    searchParams.append('sortDirection', params.sortDirection);
  }

  if (params.sortBy) {
    searchParams.append('sortBy', params.sortBy);
  }

  // Filtres créances
  if (params.statutRecouvrement) {
    searchParams.append('statutRecouvrement', params.statutRecouvrement);
  }
  if (params.groupeCreance) {
    searchParams.append('groupeCreance', params.groupeCreance);
  }
  if (params.dateCreationFrom) {
    searchParams.append('dateCreationFrom', params.dateCreationFrom);
  }
  if (params.dateCreationTo) {
    searchParams.append('dateCreationTo', params.dateCreationTo);
  }
  if (params.dateEcheanceFrom) {
    searchParams.append('dateEcheanceFrom', params.dateEcheanceFrom);
  }
  if (params.dateEcheanceTo) {
    searchParams.append('dateEcheanceTo', params.dateEcheanceTo);
  }
  if (params.typeDebiteur) {
    searchParams.append('typeDebiteur', params.typeDebiteur);
  }

  // Filtres débiteurs
  if (params.categorieDebiteur) {
    searchParams.append('categorieDebiteur', params.categorieDebiteur);
  }
  if (params.quartier) {
    searchParams.append('quartier', params.quartier);
  }
  if (params.ville) {
    searchParams.append('ville', params.ville);
  }
  if (params.statutSalarie) {
    searchParams.append('statutSalarie', params.statutSalarie);
  }

  return searchParams;
}

// Fonction utilitaire pour extraire les données paginées de la réponse API
export function extractPaginatedData<T>(apiResponse: ApiResponse<T> | undefined): PaginatedData<T> {
  if (!apiResponse?.data) {
    return {
      content: [],
      pagination: {
        totalElements: 0,
        totalPages: 0,
        size: 50,
        number: 0,
        first: true,
        last: true,
        hasNext: false,
        hasPrevious: false,
        numberOfElements: 0,
      },
      loading: false,
      error: null,
    };
  }

  const paginationData = apiResponse.data;
  
  return {
    content: paginationData.content || [],
    pagination: {
      totalElements: paginationData.totalElements || 0,
      totalPages: paginationData.totalPages || 0,
      size: paginationData.size || 50,
      number: paginationData.number || 0,
      first: paginationData.first || true,
      last: paginationData.last || false,
      hasNext: paginationData.hasNext || false,
      hasPrevious: paginationData.hasPrevious || false,
      numberOfElements: paginationData.numberOfElements || 0,
    },
    loading: false,
    error: null,
  };
}
