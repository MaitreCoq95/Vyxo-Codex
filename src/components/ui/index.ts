/**
 * Vyxo Codex UI Component Library
 *
 * Professional, accessible, and consistent UI components
 * following the Vyxo Codex design system.
 *
 * Design Philosophy: Clarity over beauty. Structure over creativity.
 */

// Button
export { Button } from './Button';
export type { ButtonProps } from './Button';

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  AlertCard,
} from './Card';
export type { CardProps, StatCardProps, AlertCardProps } from './Card';

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  MobileTableCard,
  ResponsiveTable,
  Pagination,
} from './Table';
export type { MobileTableCardProps, ResponsiveTableProps, PaginationProps } from './Table';

// Form
export {
  Label,
  Input,
  TextArea,
  Select,
  Checkbox,
  Radio,
  HelperText,
  ErrorText,
  FormField,
} from './Form';
export type {
  LabelProps,
  InputProps,
  TextAreaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  FormFieldProps,
} from './Form';

// Modal
export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ConfirmDialog,
} from './Modal';
export type { ModalProps, ConfirmDialogProps } from './Modal';

// Toast
export { ToastProvider, useToast } from './Toast';
export type { Toast, ToastVariant } from './Toast';

// Progress
export {
  ProgressBar,
  CircularProgress,
  Badge,
  StatusBadge,
  Spinner,
  Skeleton,
} from './Progress';
export type {
  ProgressBarProps,
  CircularProgressProps,
  BadgeProps,
  StatusBadgeProps,
  SpinnerProps,
  SkeletonProps,
  StatusType,
} from './Progress';

// Navigation
export {
  Header,
  Sidebar,
  BottomNav,
  MobileDrawer,
  Breadcrumbs,
} from './Navigation';
export type {
  NavItem,
  HeaderProps,
  SidebarProps,
  BottomNavProps,
  MobileDrawerProps,
  BreadcrumbsProps,
  BreadcrumbItem,
} from './Navigation';
