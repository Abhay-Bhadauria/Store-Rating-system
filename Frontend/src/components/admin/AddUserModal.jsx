import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@components/ui/Modal';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Button from '@components/ui/Button';
import { ROLES, ROLE_LABELS } from '@constants';
import { toastUtils } from '@utils';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
  address: z.string().min(1, 'Address is required'),
  role: z.enum(['admin', 'normal_user', 'store_owner'], {
    required_error: 'Role is required',
  }),
});

const roleOptions = [
  { value: 'admin', label: ROLE_LABELS.admin },
  { value: 'normal_user', label: ROLE_LABELS.normal_user },
  { value: 'store_owner', label: ROLE_LABELS.store_owner },
];

export default function AddUserModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'normal_user',
    },
  });

  const onSubmit = async (data) => {
    try {
      const { adminService } = await import('@services/admin.service');
      const response = await adminService.createUser(data);

      if (response.success) {
        onSuccess?.();
        onClose();
        reset();
      } else {
        toastUtils.error(response.message || 'Failed to create user');
      }
    } catch (error) {
      toastUtils.error(error.message || 'An error occurred while creating user');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter user name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter email address"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          error={errors.password?.message}
          helperText="Password must be at least 8 characters"
          {...register('password')}
        />

        <Input
          label="Address"
          placeholder="Enter address"
          error={errors.address?.message}
          {...register('address')}
        />

        <Select
          label="Role"
          options={roleOptions}
          error={errors.role?.message}
          {...register('role')}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
