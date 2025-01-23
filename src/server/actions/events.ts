"use server";

import "use-server";
import {z} from "zod";
import { db } from "@/Drizzle/db";
import { and, eq } from "drizzle-orm";
import {eventFormSchema} from "@/schema/events";
import { EventTable } from "@/Drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function createEvent(unsafeData: z.infer<typeof eventFormSchema>): Promise<{error: boolean} | undefined> { 
    const user = await auth();  
    
    const {success, data} = eventFormSchema.safeParse(unsafeData);

    if (!success || !user?.userId) {
        return {error: true};
    }

  await db.insert(EventTable).values({...data, clerkUserId: user.userId,})

  redirect("/events");
}

export async function UpdateEvent(id: string, unsafeData: z.infer<typeof eventFormSchema>): Promise<{error: boolean} | undefined> { 
  const user = await auth();  
  
  const {success, data} = eventFormSchema.safeParse(unsafeData);

  if (!success || !user?.userId) {
      return {error: true};
  }

  const { rowCount} =    await db
  .update(EventTable)
  .set({...data}) 
  .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, user.userId)))

  if (rowCount == 0) {
    return {error: true};
  }

redirect("/events");
}
export async function DeleteEvent(id: string) : Promise<{error: boolean} | undefined> { 
  const user = await auth();  

  if (!user?.userId) {
      return {error: true};
  }

  const { rowCount} =    await db
  .delete(EventTable) 
  .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, user.userId)))

  if (rowCount == 0) {
    return {error: true};
  }

redirect("/events");
}