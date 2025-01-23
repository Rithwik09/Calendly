"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { eventFormSchema } from "@/schema/events";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import Link from "next/link"
import { Switch } from "../ui/switch";
import { createEvent, DeleteEvent, UpdateEvent } from "@/server/actions/events";
import { AlertDialog, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle,  AlertDialogContent, AlertDialogTrigger, AlertDialogCancel, AlertDialogFooter, AlertDialogAction } from "../ui/alert-dialog";
import { useTransition } from "react";

    
export function EventForm ({event} : {event?: {
 id: string
 name: string
 description?: string
 durationInMinutes: number
 isActive: boolean
}}) {
    const [isDeletePending, StartDeleteTransition] = useTransition()
    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ?? {
            isActive: true,
            durationInMinutes: 30,
          },
      })        

      async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        const action = event == null ? createEvent : UpdateEvent.bind(null, event.id)
        const data = await action(values)
        if(data?.error){
            form.setError("root", {
                message: "There was an error creating the event"
            }) 
        }
      }

      return  <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6">
            {form.formState.errors.root && (
                <div className="text-destructive test-sm">
                    {form.formState.errors.root.message}
                </div>
            )}
            <FormField 
            control={form.control}
            name="name"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormDescription>
                        The Name User will see when Booking an Event 
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="durationInMinutes"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                        In Minutes
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="description"
            render={({field}) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                    <Textarea className="resize-none h-32" {...field} />
                    </FormControl>
                    <FormDescription>
                    Optional description of the event
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField 
            control={form.control}
            name="isActive"
            render={({field}) => (
                <FormItem>
                    <div className="flex items-center gap-2">
                    <FormControl>
                    <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                    </FormControl>
                    <FormLabel>Active</FormLabel>
                    </div>
                    <FormDescription>
                        Inactive events will not be visible for Users to book
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex gap-2 justify-end">
                {event && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructiveGhost" disabled={isDeletePending || form.formState.isSubmitting}>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                Are You Sure?
                                </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your event.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction disabled={isDeletePending || form.formState.isSubmitting}
                                variant="destructive"
                                onClick={() => {
                                    StartDeleteTransition(async () => {
                                      const data = await DeleteEvent(event.id)

                                      if(data?.error){
                                        form.setError("root", {
                                            message: "There was an error creating the event"
                                        }) 
                                    }
                                    })
                                }}
                                > 
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
             <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            type="button"
            asChild
            variant="outline"
          >
            <Link href="/events">Cancel</Link>
          </Button>
          <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            type="submit"
          >
            Save
          </Button>
            </div>
        </form>
      </Form>
      
}

