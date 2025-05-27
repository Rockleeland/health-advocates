import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql } from "drizzle-orm";
import { eq, and, or, like, inArray } from "drizzle-orm";
import { Advocate } from "@/app/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const searchTerm = searchParams.get('search') || '';
    const specialties = searchParams.get('specialties')?.split(',') || [];
    const cities = searchParams.get('cities')?.split(',') || [];
    const degrees = searchParams.get('degrees')?.split(',') || [];
    
    const sortColumn = searchParams.get('sortColumn');
    const sortDirection = searchParams.get('sortDirection') || 'asc';

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

    if (cities.length > 0) {
      conditions.push(inArray(advocates.city, cities));
    }

    if (degrees.length > 0) {
      conditions.push(inArray(advocates.degree, degrees));
    }

    let dataQuery = db
      .select()
      .from(advocates)
      // @ts-ignore - Drizzle ORM type issue with where clause
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    if (sortColumn && sortColumn in advocates) {        
        dataQuery = dataQuery.orderBy(
          advocates[sortColumn as keyof typeof advocates]!,
          sortDirection === 'desc' ? 'desc' : 'asc'
        );
      }

    const countQuery = db
        // @ts-ignore - Drizzle ORM type issue with select count
        .select({ count: sql<number>`count(*)` })
        .from(advocates)
        // @ts-ignore - Drizzle ORM type issue with where clause
        .where(conditions.length > 0 ? and(...conditions) : undefined);

    const allFilteredAdvocates = await dataQuery as Advocate[];

    const countResult = await countQuery;
    const totalBeforeSpecialtyFilter = Number(countResult[0]?.count || 0);

    const finalFilteredAdvocates = specialties.length > 0
      ? allFilteredAdvocates.filter((advocate: Advocate) => {
          try {
            const advocateSpecialties = advocate.payload;
            if (!Array.isArray(advocateSpecialties)) {
              console.error('Advocate payload is not an array:', advocate.payload);
              return false;
            }
            return specialties.some(selectedSpecialty =>
              advocateSpecialties.includes(selectedSpecialty)!
            );
          } catch (e) {
            console.error('Failed to process advocate payload:', advocate.payload, e);
            return false; 
          }
        })
      : allFilteredAdvocates;

    const paginatedAdvocates = finalFilteredAdvocates.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const totalAfterSpecialtyFilter = finalFilteredAdvocates.length;

    // @ts-ignore - Drizzle ORM type issue with selectDistinct
    const uniqueCities = await db.selectDistinct({ city: advocates.city }).from(advocates);
    // @ts-ignore - Drizzle ORM type issue with select
    const allAdvocatesForSpecialties = await db.select({ payload: advocates.payload }).from(advocates);
    // @ts-ignore - Drizzle ORM type issue with selectDistinct
    const uniqueDegrees = await db.selectDistinct({ degree: advocates.degree }).from(advocates);
    const uniqueSpecialties = Array.from(new Set(allAdvocatesForSpecialties.flatMap(adv => {
      try {         
         const advocateSpecialties = adv.payload;
         return Array.isArray(advocateSpecialties) ? advocateSpecialties : [];
      } catch (e) {
         console.error('Failed to process payload for unique specialties:', adv.payload, e);
         return [];
      }
    })));

    return Response.json({ 
      data: paginatedAdvocates,
      pagination: {
        total: totalAfterSpecialtyFilter,
        page,
        pageSize,
        totalPages: Math.ceil(totalAfterSpecialtyFilter / pageSize)
      },
      filterOptions: {
        cities: uniqueCities.map((c: { city: string }) => c.city),
        specialties: uniqueSpecialties,
        degrees: uniqueDegrees.map((d: { degree: string }) => d.degree)
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
