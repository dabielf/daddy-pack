'use client';
import { useState } from 'react';
import { ContactList } from '@/components/blocks/contactList';
import { Button } from '@/components/ui/button';
import {
  DisplayOrEdit,
  DisplayOrEditInput,
} from '@/components/blocks/displayOrEdit';

export default function Contacts() {
  const [edit, setEdit] = useState(false);
  const toggleMode = () => {
    setEdit(!edit);
  };
  return (
    <div>
      <Button onClick={toggleMode}>Click me</Button>
      <DisplayOrEdit edit={edit}>
        <div>Display</div>
        <DisplayOrEditInput value="Yolooooo" />
      </DisplayOrEdit>
      <ContactList />
    </div>
  );
}
