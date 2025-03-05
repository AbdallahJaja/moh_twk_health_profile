// Health Service - For interacting with Tawakkalna health APIs

// Mock data for initial development until the actual API is available
const mockHealthData = {
  allergies: {
    medicine: [
      { id: 1, name: "باراسيتامول", severity: "متوسطة", date: "2023-05-15" },
      { id: 2, name: "أسبرين", severity: "شديدة", date: "2023-09-22" },
    ],
    food: [
      { id: 1, name: "فراولة", severity: "خفيفة", date: "2023-04-10" },
      { id: 2, name: "مكسرات", severity: "شديدة", date: "2023-07-05" },
    ],
    material: [
      { id: 1, name: "لاتكس", severity: "متوسطة", date: "2023-03-18" },
    ],
    doctor: [],
  },
  vitals: {
    bmi: {
      value: 24.8,
      history: [
        { date: "2023-09-01", value: 24.8 },
        { date: "2023-08-01", value: 25.2 },
        { date: "2023-07-01", value: 25.6 },
      ],
    },
    bloodPressure: {
      value: { systolic: 120, diastolic: 80 },
      history: [
        { date: "2023-09-15", value: { systolic: 120, diastolic: 80 } },
        { date: "2023-08-15", value: { systolic: 122, diastolic: 82 } },
        { date: "2023-07-15", value: { systolic: 118, diastolic: 78 } },
      ],
    },
    bloodGlucose: {
      value: 95,
      history: [
        { date: "2023-09-10", value: 95 },
        { date: "2023-08-10", value: 98 },
        { date: "2023-07-10", value: 92 },
      ],
    },
    waist: {
      value: 82,
      history: [
        { date: "2023-09-05", value: 82 },
        { date: "2023-08-05", value: 83 },
        { date: "2023-07-05", value: 84 },
      ],
    },
    weight: {
      value: 75,
      history: [
        { date: "2023-09-01", value: 75 },
        { date: "2023-08-01", value: 76 },
        { date: "2023-07-01", value: 77 },
      ],
    },
    height: {
      value: 174,
      history: [{ date: "2023-01-01", value: 174 }],
    },
  },
  general: {
    bloodType: "O+",
    healthConditions: [{ id: 1, name: "ربو خفيف", date: "2022-11-22" }],
    familyHistory: [
      { id: 1, name: "سكري", relation: "والد", date: "2022-12-15" },
      { id: 2, name: "ضغط الدم", relation: "والدة", date: "2022-12-15" },
    ],
  },
  lastUpdated: {
    "allergies.medicine": "2023-09-22T10:30:00Z",
    "allergies.food": "2023-07-05T14:20:00Z",
    "allergies.material": "2023-03-18T09:15:00Z",
    "vitals.bmi": "2023-09-01T08:00:00Z",
    "vitals.bloodPressure": "2023-09-15T11:30:00Z",
    "vitals.bloodGlucose": "2023-09-10T10:45:00Z",
    "vitals.waist": "2023-09-05T09:30:00Z",
    "vitals.weight": "2023-09-01T08:00:00Z",
    "vitals.height": "2023-01-01T08:00:00Z",
    "general.bloodType": "2022-10-10T13:20:00Z",
    "general.healthConditions": "2022-11-22T15:40:00Z",
    "general.familyHistory": "2022-12-15T14:10:00Z",
  },
};

// Utility function to create a document reference number
const generateReferenceNumber = () => {
  return `health_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

/**
 * Fetch health data from Tawakkalna
 * @returns {Promise<Object>} Health data object
 */
export const fetchHealthData = async () => {
  try {
    // In a real implementation, we would fetch this from Tawakkalna APIs
    // For now, we'll use mock data

    // Simulating API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return mockHealthData;
  } catch (error) {
    console.error("Error fetching health data:", error);
    throw error;
  }
};

/**
 * Update health data in Tawakkalna
 * @param {string} category - Category (allergies, vitals, general)
 * @param {string} type - Type of data
 * @param {any} value - New value
 * @returns {Promise<boolean>} Success status
 */
export const updateHealthData = async (category, type, value) => {
  try {
    // In a real implementation, we would update this via Tawakkalna document APIs
    // For now, we'll simulate success

    // Format the data for storage
    const documentName = `health_${category}_${type}`;
    const documentContent = JSON.stringify(value);
    const referenceNumber = generateReferenceNumber();
    const categoryId = 1; // Example category ID (would be the actual health category ID in Tawakkalna)

    // For development, log what would be sent to TWK
    console.log("Updating health data via TWK.addDocument:", {
      documentName,
      content: documentContent,
      reference: referenceNumber,
      category: categoryId,
    });

    /*
      // In production, we would use the actual TWK API
      const result = await window.TWK.addDocument(
        documentName,
        documentContent,
        referenceNumber,
        categoryId
      );
      
      return result.success;
      */

    // Simulating API delay and success
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  } catch (error) {
    console.error("Error updating health data:", error);
    return false;
  }
};

/**
 * Calculate BMI based on weight and height
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;

  // Convert height from cm to m
  const heightInMeters = height / 100;

  // Calculate BMI: weight(kg) / height²(m)
  const bmi = weight / (heightInMeters * heightInMeters);

  // Round to 1 decimal place
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category based on BMI value
 * @param {number} bmi - BMI value
 * @returns {Object} BMI category details
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return {
      category: "نقص في الوزن",
      color: "blue",
      description: "مؤشر كتلة الجسم أقل من الطبيعي",
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      category: "وزن طبيعي",
      color: "green",
      description: "مؤشر كتلة الجسم ضمن المعدل الطبيعي",
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      category: "زيادة في الوزن",
      color: "yellow",
      description: "مؤشر كتلة الجسم أعلى من الطبيعي",
    };
  } else if (bmi >= 30 && bmi < 35) {
    return {
      category: "سمنة درجة أولى",
      color: "orange",
      description: "سمنة ذات خطورة معتدلة",
    };
  } else if (bmi >= 35 && bmi < 40) {
    return {
      category: "سمنة درجة ثانية",
      color: "orange-dark",
      description: "سمنة ذات خطورة عالية",
    };
  } else {
    return {
      category: "سمنة درجة ثالثة",
      color: "red",
      description: "سمنة ذات خطورة شديدة",
    };
  }
};

/**
 * Get blood pressure category
 * @param {Object} bp - Blood pressure object with systolic and diastolic values
 * @returns {Object} Blood pressure category details
 */
export const getBloodPressureCategory = (bp) => {
  const { systolic, diastolic } = bp;

  if (systolic < 120 && diastolic < 80) {
    return {
      category: "طبيعي",
      color: "green",
      description: "ضغط الدم ضمن المعدل الطبيعي",
    };
  } else if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
    return {
      category: "مرتفع",
      color: "yellow",
      description: "ارتفاع طفيف في ضغط الدم",
    };
  } else if (
    (systolic >= 130 && systolic <= 139) ||
    (diastolic >= 80 && diastolic <= 89)
  ) {
    return {
      category: "ارتفاع المرحلة الأولى",
      color: "orange",
      description: "ارتفاع في ضغط الدم (المرحلة الأولى)",
    };
  } else if (
    (systolic >= 140 && systolic <= 180) ||
    (diastolic >= 90 && diastolic <= 120)
  ) {
    return {
      category: "ارتفاع المرحلة الثانية",
      color: "red",
      description: "ارتفاع في ضغط الدم (المرحلة الثانية)",
    };
  } else if (systolic > 180 || diastolic > 120) {
    return {
      category: "أزمة ارتفاع ضغط الدم",
      color: "dark-red",
      description: "حالة طارئة - يرجى مراجعة الطبيب فوراً",
    };
  }

  return {
    category: "غير محدد",
    color: "gray",
    description: "لا يمكن تحديد الفئة بناءً على القيم المدخلة",
  };
};

/**
 * Get blood glucose category
 * @param {number} value - Blood glucose value
 * @param {boolean} isFasting - Whether the reading is fasting or not
 * @returns {Object} Blood glucose category details
 */
export const getBloodGlucoseCategory = (value, isFasting = true) => {
  if (isFasting) {
    if (value < 70) {
      return {
        category: "انخفاض سكر الدم",
        color: "blue",
        description: "مستوى سكر الدم منخفض",
      };
    } else if (value >= 70 && value <= 99) {
      return {
        category: "طبيعي",
        color: "green",
        description: "مستوى سكر الدم ضمن المعدل الطبيعي",
      };
    } else if (value >= 100 && value <= 125) {
      return {
        category: "مقدمات السكري",
        color: "yellow",
        description: "مستوى سكر الدم مرتفع قليلاً - مقدمات السكري",
      };
    } else {
      return {
        category: "مرتفع",
        color: "red",
        description: "مستوى سكر الدم مرتفع - يشير إلى مرض السكري",
      };
    }
  } else {
    // For non-fasting / random readings
    if (value < 70) {
      return {
        category: "انخفاض سكر الدم",
        color: "blue",
        description: "مستوى سكر الدم منخفض",
      };
    } else if (value >= 70 && value <= 139) {
      return {
        category: "طبيعي",
        color: "green",
        description: "مستوى سكر الدم ضمن المعدل الطبيعي",
      };
    } else if (value >= 140 && value <= 199) {
      return {
        category: "مقدمات السكري",
        color: "yellow",
        description: "مستوى سكر الدم مرتفع قليلاً - مقدمات السكري",
      };
    } else {
      return {
        category: "مرتفع",
        color: "red",
        description: "مستوى سكر الدم مرتفع - يشير إلى مرض السكري",
      };
    }
  }
};
