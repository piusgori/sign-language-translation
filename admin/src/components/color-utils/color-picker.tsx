import { Ref, forwardRef, useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import ButtonBase from '@mui/material/ButtonBase';
import { Check } from '@mui/icons-material';

// ----------------------------------------------------------------------

interface CP {
    colors: any,
    selected: any,
    onSelectColor: any,
    limit?: any,
    sx?: any
}

const ColorPicker = forwardRef(
  ({ colors, selected, onSelectColor, limit = 'auto', sx, ...other }: CP, ref: Ref<HTMLDivElement>) => {
    const singleSelect = typeof selected === 'string';

    const handleSelect = useCallback(
      (color: any) => {
        if (singleSelect) {
          if (color !== selected) {
            onSelectColor(color);
          }
        } else {
          const newSelected = selected.includes(color)
            ? selected.filter((value: any) => value !== color)
            : [...selected, color];

          onSelectColor(newSelected);
        }
      },
      [onSelectColor, selected, singleSelect]
    );

    return (
      <Stack
        ref={ref}
        direction="row"
        display="inline-flex"
        sx={{
          flexWrap: 'wrap',
          ...(limit !== 'auto' && {
            width: limit * 36,
            justifyContent: 'flex-end',
          }),
          ...sx,
        }}
        {...other}
      >
        {colors.map((color: any) => {
          const hasSelected = singleSelect ? selected === color : selected.includes(color);

          return (
            <ButtonBase
              key={color}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
              }}
              onClick={() => {
                handleSelect(color);
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: color,
                  borderRadius: '50%',
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                  ...(hasSelected && {
                    transform: 'scale(1.3)',
                    boxShadow: `4px 4px 8px 0 ${alpha(color, 0.48)}`,
                    outline: `solid 2px ${alpha(color, 0.08)}`,
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }),
                }}
              >
                <Check
                  sx={{
                    width: hasSelected ? 12 : 0,
                    color: (theme: any) => theme.palette.getContrastText(color),
                    transition: (theme: any) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }}
                />
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>
    );
  }
);


export default ColorPicker;
