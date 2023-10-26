export enum EventSourceEnum {
  CONTACT_ID = 'ContactID',
  SIA = 'SIA',
}

export enum EventColorEnum {
  ONE = '#FF1003',
  TWO = '#0000FF',
  THREE = '#ECDE00',
  FOUR = '#FFFFFF',
  FIVE = '#006666',
  SIX = '#FF66CC',
  SEVEN = '#FF6600',
  EIGHT = '#800000',
  NINE = '#00FFFF',
  TEN = '#6600CC',
}

export enum EventStatusEnum {
  IN_PROGRESS = 'PRG',
  PENDING = 'PND',
  ON_TRACK = 'TRK',
  CLOSED = 'CLO',
  OTHER = 'OTH',
}

export enum EventTypeEnum {
  CENTRAL = 'CENTRAL DE ALARMA',
  ACTIVATIONS = 'ACTIVACIONES',
  FAILURES = 'FALLAS DE ALARMA',
  OPEN_CLOSE = 'APERTURAS Y CIERRES',
  BYPASS = 'ZONABYPASS',
  AUTOTEST = 'AUTOTEST',
  OTHER = 'SIN DESCRIPCIÓN',
}
