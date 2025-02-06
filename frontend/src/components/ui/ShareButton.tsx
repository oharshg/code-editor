import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {z} from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Profanity } from "@2toad/profanity";
import profaneWords from "@/config/profane-words.json";


const FormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
});

export default function ShareButton({
  children,
}: {
  children: [React.ReactNode, React.ReactNode];
}) {
  const profanityFilter = new Profanity({
    languages: ["ar", "zh", "en", "fr", "de", "hi", "ja", "ko", "pt", "ru", "es"],
  });
  profanityFilter.addWords(profaneWords.en);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (profanityFilter.exists(data.title)) {
      toast.error("Profanity detected in title! Please remove profane words from the title.");
      return;
    }
    try {
      axios
        .post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/post`,
          { title: data.title, code: children?.[0], language: children?.[1] },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          toast.success("Code shared successfully");
          setOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            size={"sm"}
            className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
          >
            Share
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share the code</AlertDialogTitle>
            <AlertDialogDescription>
              Add a title to the code snippet to share it with others.
            </AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button type="submit">Share</Button>
                </div>
              </form>
            </Form>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
