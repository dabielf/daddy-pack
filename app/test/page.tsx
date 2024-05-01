import {
  ActionMenu,
  ActionTrigger,
  ActionItems,
  ActionItem,
} from '@/components/animations/actionMenu';

import { NewDaddyButton } from '@/components/blocks/newDaddyDialog';
import { NewDateButton } from '@/components/blocks/newDateDialog';
import { NewContactButton } from '@/components/blocks/newContactDialog';

export default function DaddiesPage() {
  return (
    <div>
      <ActionMenu>
        <ActionTrigger />
        <ActionItems>
          <ActionItem>
            <NewDaddyButton />
          </ActionItem>
          <ActionItem>
            <NewDateButton />
          </ActionItem>
          <ActionItem>
            <NewContactButton />
          </ActionItem>
        </ActionItems>
      </ActionMenu>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
      <p>Text that i dont want to be animated. Lorem ipsum dolor sit amet</p>
    </div>
  );
}
