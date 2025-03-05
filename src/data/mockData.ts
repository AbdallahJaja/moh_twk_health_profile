export interface MenuItem {
  id: string;
  title: string;
  type: string;
  icon: string;
  count?: number;
  value?: string | number;
  items?: MenuItem[];
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  items: MenuItem[];
}

export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  healthRecordId: string;
  avatarUrl?: string;
}

export const userProfile: UserProfile = {
  id: '1234567890',
  name: 'عبدالله محمد',
  gender: 'male',
  birthDate: '1990-01-01',
  healthRecordId: 'MRN-10254367'
};

export const dashboardSections: Section[] = [
  {
    id: 'allergies',
    title: 'sections.allergies.title',
    icon: 'Heart',
    color: 'red',
    items: [
      {
        id: 'medicine',
        title: 'sections.allergies.medicine',
        type: 'medicine',
        icon: 'Pill',
        count: 2
      },
      {
        id: 'food',
        title: 'sections.allergies.food',
        type: 'food',
        icon: 'Coffee',
        count: 2
      },
      {
        id: 'material',
        title: 'sections.allergies.material',
        type: 'material',
        icon: 'Shirt',
        count: 1
      },
      {
        id: 'doctor',
        title: 'sections.allergies.doctor',
        type: 'doctor',
        icon: 'Stethoscope',
        count: 0
      }
    ]
  },
  {
    id: 'vitals',
    title: 'sections.vitals.title',
    icon: 'Activity',
    color: 'blue',
    items: [
      {
        id: 'bmi',
        title: 'sections.vitals.bmi',
        type: 'bmi',
        icon: 'Scale',
        value: 24.8
      },
      {
        id: 'blood-pressure',
        title: 'sections.vitals.bloodPressure',
        type: 'blood-pressure',
        icon: 'Heart',
        value: '120/80'
      },
      {
        id: 'blood-glucose',
        title: 'sections.vitals.bloodGlucose',
        type: 'blood-glucose',
        icon: 'Droplet',
        value: 95
      },
      {
        id: 'waist',
        title: 'sections.vitals.waist',
        type: 'waist',
        icon: 'Ruler',
        value: 82
      },
      {
        id: 'weight',
        title: 'sections.vitals.weight',
        type: 'weight',
        icon: 'Scale',
        value: 75
      },
      {
        id: 'height',
        title: 'sections.vitals.height',
        type: 'height',
        icon: 'Ruler',
        value: 174
      }
    ]
  },
  {
    id: 'medications',
    title: 'sections.medications.title',
    icon: 'Pill',
    color: 'purple',
    items: [
      {
        id: 'current',
        title: 'sections.medications.current',
        type: 'current',
        icon: 'Clock',
        count: 2
      },
      {
        id: 'previous',
        title: 'sections.medications.previous',
        type: 'previous',
        icon: 'ClockRewind',
        count: 3
      }
    ]
  },
  {
    id: 'general',
    title: 'sections.general.title',
    icon: 'Users',
    color: 'green',
    items: [
      {
        id: 'blood-type',
        title: 'sections.general.bloodType',
        type: 'blood-type',
        icon: 'Droplet',
        value: 'O+'
      },
      {
        id: 'health-conditions',
        title: 'sections.general.healthConditions',
        type: 'health-conditions',
        icon: 'ClipboardList',
        count: 1
      },
      {
        id: 'family-history',
        title: 'sections.general.familyHistory',
        type: 'family-history',
        icon: 'Users',
        count: 2
      },
      {
        id: 'health-centers',
        title: 'sections.general.healthCenters',
        type: 'health-centers',
        icon: 'Map',
        count: 1
      }
    ]
  }
];