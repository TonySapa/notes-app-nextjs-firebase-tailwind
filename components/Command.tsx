import cn from 'classnames';
import Palette from 'components/Palette';
import { PALETTE } from 'lib/constant';
import Notes from 'lib/database';
import { Colors } from 'lib/types';
import { useTheme } from 'next-themes';
import { useEffect, useState, type FormEvent } from 'react';
import { useSWRConfig } from 'swr';
import Button from './Button';

const initialValues = {
  title: '',
  content: '',
  status: true,
  pinned: false,
  archived: false,
  color: 'default',
};

const Command = () => {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState(initialValues);
  const [mounted, setMounted] = useState(false);

  const { theme } = useTheme();
  const { mutate } = useSWRConfig();

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (data.title || data.content) {
      try {
        await Notes.create(data);
        setToggle(false);
        setData(initialValues);
        mutate('/api/notes');
      } catch (error) {
        //
      }
    }

    setToggle(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      // onBlur={() => setToggle(false)}
      className={cn(
        'mx-auto my-10 w-3/4 rounded-2xl border-[1px] border-gray-100 shadow-xl shadow-blue-50 dark:shadow-none ease-in lg:w-1/2',
        data.color
          ? PALETTE[theme as 'light' | 'dark'][data.color as Colors]
          : 'bg-white dark:bg-shark',
        (data.color === 'default' || !data.color) &&
          'dark:border dark:border-shuttle-gray'
      )}
    >
      <form
        noValidate
        className='p-4'
        autoComplete='off'
        onSubmit={handleSubmit}
        onFocus={() => setToggle(true)}
      >
        <div className='flex items-center'>
          <input
            type='text'
            name='title'
            value={data.title}
            placeholder='Take a note...'
            onChange={handleChange}
            className='command-title text-xl font-extrabold'
          />
          <Button
            icon='push_pin'
            filled={data.pinned}
            onClick={() => setData({ ...data, pinned: !data.pinned })}
          />
        </div>

        <textarea
          name='content'
          value={data.content}
          onChange={handleChange}
          className='command-text placeholder-gray-300'
          placeholder='Take a note...'
        />

          <div className='flex flex-col items-center justify-between gap-2 lg:flex-row'>
            <Palette state={data} setState={setData} />

            <button
              type='submit'
              className='command-btn lg:w-auto lg:bg-transparent lg:hover:bg-blue-100 lg:dark:hover:bg-black-thu color-red'
            >
              Done
            </button>
          </div>
      </form>
    </div>
  );
};

export default Command;
