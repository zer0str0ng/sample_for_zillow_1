export enum TechServiceStatusEnum {
  // ROOT, ADMIN, COORDINATOR (This could have technician and client undefined)
  CREATED = 'Created',
  CANCELLED = 'Cancelled',
  RESCHEDULE = 'Reschedule',
  // ROOT, ADMIN, COORDINATOR
  PENDING = 'Pending',
  // ROOT, ADMIN, TECHNICIAN (This needs an assigned client depending on the isClientRequired)
  COMPLETED_PAID = 'CompletedPaid',
  COMPLETED_NON_PAID = 'CompletedNonPaid',
  // ROOT, ADMIN, COORDINATOR
  REVIEWED = 'Reviewed',
  // ROOT, ADMIN, DEBT
  PAYMENT_CONFIRMATION = 'PaymentConfirmation',
  // ROOT, ADMIN, COORDINATOR
  FINISHED = 'Finished',
}

export enum TechServicePriorityEnum {
  CRITICAL = 'Critical',
  HIGH = 'High',
  NORMAL = 'Normal',
  LOW = 'Low',
}

export enum TechServiceQuizCategoryEnum {
  TECHNICIAN = 'Technician',
  PRODUCT = 'Product',
  PRICE = 'Price',
  EXPECTATION = 'Expectation',
}
