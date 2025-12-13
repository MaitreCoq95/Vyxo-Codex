/**
 * Vyxo Codex 2.0 - Database Query Builder
 * Requêtes Supabase optimisées avec cache et pagination
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Résultat paginé
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

/**
 * Options de filtre pour les requêtes
 */
export interface FilterOptions {
  search?: string;
  searchFields?: string[];
  filters?: Record<string, any>;
  dateRange?: {
    field: string;
    start: string;
    end: string;
  };
}

/**
 * Client Supabase optimisé avec méthodes helper
 */
export class DatabaseClient {
  private supabase;

  constructor(useServiceRole: boolean = false) {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      useServiceRole
        ? process.env.SUPABASE_SERVICE_ROLE_KEY!
        : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Requête paginée avec comptage optimisé
   */
  async paginate<T = any>(
    table: string,
    options: PaginationOptions & FilterOptions = {}
  ): Promise<PaginatedResult<T>> {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search,
      searchFields = [],
      filters = {},
      dateRange,
    } = options;

    // Calculer offset
    const offset = (page - 1) * pageSize;

    // Construire la requête
    let query = this.supabase.from(table).select('*', { count: 'exact' });

    // Appliquer les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    // Appliquer la recherche textuelle
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields
        .map((field) => `${field}.ilike.%${search}%`)
        .join(',');
      query = query.or(searchConditions);
    }

    // Appliquer le range de dates
    if (dateRange) {
      query = query
        .gte(dateRange.field, dateRange.start)
        .lte(dateRange.field, dateRange.end);
    }

    // Appliquer le tri et la pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: data as T[],
      pagination: {
        page,
        pageSize,
        totalPages,
        totalItems,
        hasMore: page < totalPages,
      },
    };
  }

  /**
   * Requête avec cache simple (en mémoire)
   */
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTTL = 60000; // 1 minute

  async cached<T = any>(
    cacheKey: string,
    queryFn: () => Promise<T>,
    ttl: number = this.cacheTTL
  ): Promise<T> {
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    const data = await queryFn();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  /**
   * Nettoyer le cache
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Bulk insert optimisé
   */
  async bulkInsert<T = any>(
    table: string,
    records: any[],
    batchSize: number = 100
  ): Promise<{ inserted: number; errors: any[] }> {
    const errors: any[] = [];
    let inserted = 0;

    // Diviser en batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      const { data, error } = await this.supabase
        .from(table)
        .insert(batch)
        .select();

      if (error) {
        errors.push({ batch: i / batchSize, error });
      } else {
        inserted += data?.length || 0;
      }
    }

    return { inserted, errors };
  }

  /**
   * Bulk update optimisé
   */
  async bulkUpdate<T = any>(
    table: string,
    updates: Array<{ id: string; data: Partial<T> }>,
    batchSize: number = 50
  ): Promise<{ updated: number; errors: any[] }> {
    const errors: any[] = [];
    let updated = 0;

    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      const promises = batch.map(({ id, data }) =>
        this.supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
      );

      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && !result.value.error) {
          updated++;
        } else {
          errors.push({
            index: i + index,
            error: result.status === 'rejected' ? result.reason : result.value.error,
          });
        }
      });
    }

    return { updated, errors };
  }

  /**
   * Requête avec retry automatique
   */
  async withRetry<T>(
    queryFn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await queryFn();
      } catch (error) {
        lastError = error;

        if (attempt < maxRetries - 1) {
          // Exponential backoff
          await new Promise((resolve) =>
            setTimeout(resolve, delayMs * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError;
  }

  /**
   * Agrégations courantes
   */
  async aggregate(
    table: string,
    aggregations: {
      count?: boolean;
      sum?: string[];
      avg?: string[];
      min?: string[];
      max?: string[];
    },
    filters: FilterOptions = {}
  ): Promise<Record<string, number>> {
    let query = this.supabase.from(table).select('*');

    // Appliquer les filtres
    if (filters.filters) {
      Object.entries(filters.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) throw error;

    const result: Record<string, number> = {};

    if (aggregations.count) {
      result.count = data?.length || 0;
    }

    if (data && data.length > 0) {
      // Sum
      aggregations.sum?.forEach((field) => {
        result[`sum_${field}`] = data.reduce(
          (sum, row) => sum + (Number(row[field]) || 0),
          0
        );
      });

      // Avg
      aggregations.avg?.forEach((field) => {
        const sum = data.reduce(
          (sum, row) => sum + (Number(row[field]) || 0),
          0
        );
        result[`avg_${field}`] = sum / data.length;
      });

      // Min
      aggregations.min?.forEach((field) => {
        result[`min_${field}`] = Math.min(
          ...data.map((row) => Number(row[field]) || 0)
        );
      });

      // Max
      aggregations.max?.forEach((field) => {
        result[`max_${field}`] = Math.max(
          ...data.map((row) => Number(row[field]) || 0)
        );
      });
    }

    return result;
  }

  /**
   * Upsert avec conflit resolution
   */
  async upsert<T = any>(
    table: string,
    record: any,
    conflictColumns: string[]
  ): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(table)
      .upsert(record, {
        onConflict: conflictColumns.join(','),
      })
      .select()
      .single();

    if (error) throw error;

    return data as T;
  }

  /**
   * Soft delete (mise à jour du champ deleted_at)
   */
  async softDelete(
    table: string,
    id: string,
    deletedByUserId?: string
  ): Promise<void> {
    const updateData: any = {
      deleted_at: new Date().toISOString(),
    };

    if (deletedByUserId) {
      updateData.deleted_by = deletedByUserId;
    }

    const { error } = await this.supabase
      .from(table)
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Restore soft deleted record
   */
  async restore(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .update({ deleted_at: null, deleted_by: null })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Exécuter une fonction RPC avec typage
   */
  async rpc<T = any>(
    functionName: string,
    params?: Record<string, any>
  ): Promise<T> {
    const { data, error } = await this.supabase.rpc(functionName, params);

    if (error) throw error;

    return data as T;
  }

  /**
   * Batch RPC calls
   */
  async batchRpc<T = any>(
    calls: Array<{ function: string; params?: Record<string, any> }>
  ): Promise<T[]> {
    const promises = calls.map(({ function: fn, params }) =>
      this.supabase.rpc(fn, params)
    );

    const results = await Promise.all(promises);

    return results.map((result) => {
      if (result.error) throw result.error;
      return result.data as T;
    });
  }
}

/**
 * Requêtes optimisées courantes pour Vyxo Codex
 */

export const VyxoQueries = {
  /**
   * Obtenir le profil complet avec stats
   */
  async getUserProfile(userId: string) {
    const db = new DatabaseClient();

    return db.cached(`profile:${userId}`, async () => {
      const { data, error } = await db['supabase']
        .from('profiles')
        .select(
          `
          *,
          teams:team_id (id, name, manager_id),
          companies:company_id (id, name, imo_score, imo_level)
        `
        )
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    });
  },

  /**
   * Obtenir les notifications non lues
   */
  async getUnreadNotifications(userId: string, limit: number = 20) {
    const db = new DatabaseClient();

    const { data, error } = await db['supabase']
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  /**
   * Obtenir les badges d'un utilisateur
   */
  async getUserBadges(userId: string) {
    const db = new DatabaseClient();

    return db.cached(`badges:${userId}`, async () => {
      const { data, error } = await db['supabase']
        .from('badge_awards')
        .select('*, badges:badge_id (*)')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });

      if (error) throw error;
      return data;
    }, 300000); // Cache 5 minutes
  },

  /**
   * Statistiques d'équipe
   */
  async getTeamStats(teamId: string) {
    const db = new DatabaseClient();

    return db.rpc('get_team_statistics', { p_team_id: teamId });
  },

  /**
   * Leaderboard
   */
  async getLeaderboard(
    scope: 'global' | 'company' | 'team',
    scopeId?: string,
    limit: number = 10
  ) {
    const db = new DatabaseClient();

    let query = db['supabase']
      .from('profiles')
      .select('id, full_name, total_xp, current_streak, role')
      .order('total_xp', { ascending: false })
      .limit(limit);

    if (scope === 'company' && scopeId) {
      query = query.eq('company_id', scopeId);
    } else if (scope === 'team' && scopeId) {
      query = query.eq('team_id', scopeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },
};
