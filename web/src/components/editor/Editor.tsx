import '../../utils/highlight';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
//
import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';

interface ED {
  id?: string;
  error?: any,
  required?: boolean;
  placeholder: string;
  value: string;
  onChange: () => void;
  simple?: boolean;
  helperText?: any;
  sx?: object
}


export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  placeholder,
  required,
  simple = false,
  helperText,
  sx,
  ...other
}: ED) {
  const modules = {
    toolbar: {
      container: `#${id}`,
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme: any) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
        <EditorToolbar id={id} isSimple={simple} />

        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}
