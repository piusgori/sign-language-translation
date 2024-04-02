import { ReactNode } from 'react';
import { FormProvider as Form } from 'react-hook-form';

const FormProvider = ({ children, onSubmit, methods }: { children: ReactNode, onSubmit: (data: any) => void, methods: any }) => {
  return (
    <Form { ...methods }>
        <form style={{ width: '100%' }} onSubmit={onSubmit}>{children}</form>
    </Form>
  )
}

export default FormProvider