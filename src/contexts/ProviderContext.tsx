import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { providerService } from '../services/provider-service';
import type {
	Game,
	Category,
	PaginatedResponse,
} from '../types/game';

/**
 * Provider Context Value Interface
 * 
 * Defines the shape of the context value that will be provided
 * to components consuming this context.
 */
interface ProviderContextValue {
	/** Loading state for ongoing operations */
	isLoading: boolean;
	/** Error state for failed operations */
	error: Error | null;
	/** Fetch a paginated list of games */
	fetchGames: (page?: number, limit?: number) => Promise<Game[]>;
	/** Fetch a single game by ID */
	fetchGameById: (id: number) => Promise<Game>;
	/** Search for games by query */
	searchGames: (query: string) => Promise<Game[]>;
	/** Fetch available categories */
	fetchCategories: () => Promise<Category[]>;
	/** Fetch games with pagination metadata */
	fetchGamesPaginated: (page?: number, limit?: number) => Promise<PaginatedResponse<Game>>;
	/** Fetch games by category */
	fetchGamesByCategory: (categoryId: number, page?: number, limit?: number) => Promise<Game[]>;
	/** Clear the current error */
	clearError: () => void;
	/** Check if the provider is healthy */
	healthCheck: () => Promise<boolean>;
	/** Clear the provider cache */
	clearCache: () => void;
}

/**
 * Create the Provider Context
 */
const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);

/**
 * Provider Context Props
 */
interface ProviderContextProps {
	/** Child components that will have access to the provider context */
	children: ReactNode;
}

/**
 * Provider Context Component
 * 
 * This component wraps the application and provides access to the provider service
 * with built-in loading and error state management.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ProviderContextProvider>
 *       <YourApp />
 *     </ProviderContextProvider>
 *   );
 * }
 * ```
 */
export function ProviderContextProvider({ children }: ProviderContextProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	/**
	 * Set loading state and handle errors consistently
	 */
	const withLoading = useCallback(
		async <T,>(
			operation: () => Promise<T>,
			context: string
		): Promise<T> => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await operation();
				return result;
			} catch (err) {
				const errorObj = err instanceof Error ? err : new Error(String(err));
				setError(errorObj);
				throw errorObj;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	/**
	 * Fetch a paginated list of games
	 */
	const fetchGames = useCallback(
		async (page = 1, limit = 10): Promise<Game[]> => {
			return withLoading(
				() => providerService.getGames(page, limit),
				'fetchGames'
			);
		},
		[withLoading]
	);

	/**
	 * Fetch a single game by ID
	 */
	const fetchGameById = useCallback(
		async (id: number): Promise<Game> => {
			return withLoading(
				() => providerService.getGameById(id),
				'fetchGameById'
			);
		},
		[withLoading]
	);

	/**
	 * Search for games by query
	 */
	const searchGames = useCallback(
		async (query: string): Promise<Game[]> => {
			return withLoading(
				() => providerService.searchGames(query),
				'searchGames'
			);
		},
		[withLoading]
	);

	/**
	 * Fetch available categories
	 */
	const fetchCategories = useCallback(
		async (): Promise<Category[]> => {
			return withLoading(
				() => providerService.getCategories(),
				'fetchCategories'
			);
		},
		[withLoading]
	);

	/**
	 * Fetch games with pagination metadata
	 */
	const fetchGamesPaginated = useCallback(
		async (page = 1, limit = 10): Promise<PaginatedResponse<Game>> => {
			return withLoading(
				() => providerService.getGamesPaginated(page, limit),
				'fetchGamesPaginated'
			);
		},
		[withLoading]
	);

	/**
	 * Fetch games by category
	 */
	const fetchGamesByCategory = useCallback(
		async (categoryId: number, page = 1, limit = 10): Promise<Game[]> => {
			return withLoading(
				() => providerService.getGamesByCategory(categoryId, page, limit),
				'fetchGamesByCategory'
			);
		},
		[withLoading]
	);

	/**
	 * Clear the current error
	 */
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	/**
	 * Check if the provider is healthy
	 */
	const healthCheck = useCallback(async (): Promise<boolean> => {
		return withLoading(
			() => providerService.healthCheck(),
			'healthCheck'
		);
	},
	[withLoading]
);

	/**
	 * Clear the provider cache
	 */
	const clearCache = useCallback(() => {
		try {
			providerService.clearCache();
		} catch (err) {
			const errorObj = err instanceof Error ? err : new Error(String(err));
			setError(errorObj);
		}
	}, []);

	const contextValue: ProviderContextValue = {
		isLoading,
		error,
		fetchGames,
		fetchGameById,
		searchGames,
		fetchCategories,
		fetchGamesPaginated,
		fetchGamesByCategory,
		clearError,
		healthCheck,
		clearCache,
	};

	return (
		<ProviderContext.Provider value={contextValue}>
			{children}
		</ProviderContext.Provider>
	);
}

/**
 * Custom hook to access the Provider Context
 * 
 * This hook provides easy access to the provider service and its state.
 * It must be used within a component that is wrapped by ProviderContextProvider.
 * 
 * @throws Error if used outside of ProviderContextProvider
 * 
 * @example
 * ```tsx
 * function GameList() {
 *   const { fetchGames, isLoading, error } = useProvider();
 * 
 *   useEffect(() => {
 *     fetchGames(1, 10);
 *   }, []);
 * 
 *   if (isLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} />;
 * 
 *   // Render games...
 * }
 * ```
 */
export function useProvider(): ProviderContextValue {
	const context = useContext(ProviderContext);

	if (context === undefined) {
		throw new Error(
			'useProvider must be used within a ProviderContextProvider. ' +
			'Wrap your component tree with <ProviderContextProvider>.'
		);
	}

	return context;
}