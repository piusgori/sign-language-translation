import { ReactNode } from 'react';
import { FormProvider as Form } from 'react-hook-form';

const FormProvider = ({ children, methods }: { children: ReactNode, methods: any }) => {
  return (
    <Form { ...methods }>
        {children}
    </Form>
  )
}

export default FormProvider;