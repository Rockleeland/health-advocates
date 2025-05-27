import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql } from "drizzle-orm";
import { eq, and, or, like, inArray } from "drizzle-orm";

// TODO: Fix Drizzle ORM type issues. The current implementation works at runtime
// but needs proper typing for the query builder chain and count query.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;

    const searchTerm = searchParams.get('search') || '';
    const specialties = searchParams.get('specialties')?.split(',') || [];
    const cities = searchParams.get('cities')?.split(',') || [];
    const degrees = searchParams.get('degrees')?.split(',') || [];
    
    const sortColumn = searchParams.get('sortColumn');
    const sortDirection = searchParams.get('sortDirection') || 'asc';

    console.log('Query parameters:', {
      page,
      pageSize,
      searchTerm,
      specialties,
      cities,
      degrees,
      sortColumn,
      sortDirection
    });

    const conditions = [];
    
    if (searchTerm) {
      conditions.push(
        or(
          like(advocates.firstName, `%${searchTerm}%`),
          like(advocates.lastName, `%${searchTerm}%`),
          like(advocates.city, `%${searchTerm}%`)
        )
      );
    }

    if (specialties.length > 0) {
      conditions.push(sql`payload::jsonb ?| array[${specialties}]`);
    }

    if (cities.length > 0) {
      conditions.push(inArray(advocates.city, cities));
    }

    if (degrees.length > 0) {
      conditions.push(inArray(advocates.degree, degrees));
    }

    // @ts-ignore - Drizzle ORM type issue with query builder chain
    const dataQuery = db
      .select()
      .from(advocates)
      // @ts-ignore - Drizzle ORM type issue with where clause
      .where(conditions.length > 0 ? and(...conditions) : undefined)      
      .orderBy(
        sortColumn && sortColumn in advocates
          ? advocates[sortColumn as keyof typeof advocates]
          : advocates.id,
        sortDirection === 'desc' ? 'desc' : 'asc'
      )
      .limit(pageSize)
      .offset(offset);

    console.log('Executing query...');
    const data = await dataQuery;
    console.log('Query result:', data);

    const countResult = await db
      // @ts-ignore - Drizzle ORM type issue with select count
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      // @ts-ignore - Drizzle ORM type issue with where clause
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    const total = Number(countResult[0]?.count || 0);

    return Response.json({ 
      data,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
