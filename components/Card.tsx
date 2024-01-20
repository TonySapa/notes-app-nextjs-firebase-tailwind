import cn from 'classnames';
import { PALETTE } from 'lib/constant';
import Notes from 'lib/database';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import Button from './Button';

import type { Colors, Note } from 'lib/types';

interface CardProps {
  note: Note;
  editable?: boolean;
}

const Card = ({ note, editable }: CardProps) => {
  const [toggle, setToggle] = useState(false);
  const { mutate } = useSWRConfig();
  const { theme } = useTheme();
  const { push, pathname } = useRouter();

  const { id, pinned, content, title, color, status, archived } = note;

  const BUTTONS = [
    {
      title: archived ? 'Unarchive' : 'Archive',
      icon: archived ? 'unarchive' : 'archive',
      onClick: async () => {
        try {
          await Notes.update(id, { ...note, archived: !archived });
          mutate('/api/notes');
        } catch (error) {
          //
        }
      },
    },
    {
      title: 'Delete',
      icon: 'delete',
      onClick: async () => {
        try {
          await Notes.update(id, {
            ...note,
            status: !status,
            ...(pathname === '/archive' && { archived: false }),
          });
          mutate('/api/notes');
        } catch (error) {
          //
        }
      },
    }
  ];

  const TRASH_BUTTONS = [
    {
      title: 'Delete Forever',
      icon: 'delete_forever',
      onClick: async () => {
        try {
          await Notes.delete(id);
          mutate('/api/notes');
        } catch (error) {
          //
        }
      },
    },
    {
      title: 'Restore',
      icon: 'restore_from_trash',
      onClick: async () => {
        try {
          await Notes.update(id, { ...note, status: !status });
          mutate('/api/notes');
        } catch (error) {
          //
        }
      },
    },
  ];

  return (
    <div
      className={cn(
        'relative col-span-1 flex h-fit flex-col justify-between rounded-2xl p-4 hover:shadow-blue-100 cursor-text border-[0.25px] border-blue-50 dark:border-shuttle-gray shadow-xl shadow-blue-50 dark:shadow-none ease-in',
        color !== 'default' &&
          PALETTE[theme as 'light' | 'dark'][color as Colors],
        color === 'default'
      )}
      onMouseOver={() => setToggle(true)}
      onMouseOut={() => setToggle(false)}
      onClick={() => push(`/NOTE/${id}`)}
    >
      <div
        className={cn(
          'absolute right-1.5 top-1.5 opacity-0 transition-all duration-300',
          toggle && 'opacity-100'
        )}
      >
        <Button
          title={`${pinned ? 'Unpin' : 'Pin'} Note`}
          onClick={async () => {
            await Notes.update(id as string, { ...note, pinned: !pinned });
            mutate('/api/notes');
          }}
          filled={pinned}
          icon='push_pin'
        />
      </div>

      {title && (
        <h1 className='mb-2 w-10/12 break-words font-medium text-shark dark:text-athens-gray'>
          {title}
        </h1>
      )}

      {content && (
        <p className='break-words text-sm text-shark dark:text-athens-gray'>
          {content.length <= 80 ? content : content.slice(0, 77) + '...'}
        </p>
      )}

      <div
        className={cn(
          'flex items-center opacity-0 transition-all duration-300 mt-2',
          toggle && 'opacity-100'
        )}
      >
        {note.status
          ? BUTTONS.map((button, index) => (
              <Button key={index} {...button} size='md' />
            ))
          : TRASH_BUTTONS.map((button, index) => (
              <Button key={index} {...button} size='md' />
            ))}
      </div>
    </div>
  );
};

export default Card;
