"use client";
import { api } from "@/convex/_generated/api";
import { format } from "date-fns";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const userApiKeys = useQuery(api.users.getUserApiKeys);
  const createApiKey = useMutation(api.users.createUserApiKey);

  const handleCreateKey = async () => {
    const apiKey = await createApiKey({ title });
    setTitle("");
  };

  const [title, setTitle] = useState("");
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold">Settings</h1>

      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button disabled={!title || title.length <= 3} onClick={handleCreateKey}>
        Create New API Key
      </Button>
      {userApiKeys && (
        <ul>
          {userApiKeys.map((apiKey) => (
            <li key={apiKey._id}>
              {apiKey.title} - {apiKey.key}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
