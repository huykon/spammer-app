import type { ActionArgs } from "@remix-run/node";
import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import Login from "components/login";
import RealtimeMessages from "components/realtime-messages";
import { useEffect, useRef } from "react";
import createServerSupabase from "utils/supabase.server";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Toto chat" },
    { name: "description", content: "Welcome to Toto chat application!" },
  ];
};

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const { message } = Object.fromEntries(await request.formData());
  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) });

  if (error) {
    console.log(error);
  }

  return json(null, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  const transition = useNavigation();

  const isSubmittingForm = transition.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isSubmittingForm) {
      formRef.current?.reset();
    }
  }, [isSubmittingForm]);

  return (
    <div>
      <h1>Free chat</h1>
      <Login />
      <RealtimeMessages serverMessages={messages} />
      <Form method="post" ref={formRef}>
        <input type="text" name="message" />
        <button type="submit" disabled={isSubmittingForm}>
          Send
        </button>
      </Form>
    </div>
  );
}
