// Student Service for handling student-related API calls

const API_BASE_URL = '/students'; // Using relative path for proxy

class StudentService {
  // Get student payment information
  async getStudentPaymentInfo(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}/payments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch payment info' }));
        throw new Error(errorData.error || `Failed to fetch payment info: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Payment info error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch payment information'
      };
    }
  }

  // Get payment history
  async getPaymentHistory(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}/payments/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch payment history' }));
        throw new Error(errorData.error || `Failed to fetch payment history: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Payment history error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch payment history'
      };
    }
  }

  // Make a payment
  async makePayment(studentId, paymentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Payment failed' }));
        throw new Error(errorData.error || `Payment failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        message: error.message || 'Payment failed'
      };
    }
  }

  // Get student personal information
  async getStudentPersonalInfo(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}/personal`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch personal info' }));
        throw new Error(errorData.error || `Failed to fetch personal info: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Personal info error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch personal information'
      };
    }
  }

  // Get student academic information
  async getStudentAcademicInfo(studentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${studentId}/academic`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch academic info' }));
        throw new Error(errorData.error || `Failed to fetch academic info: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Academic info error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch academic information'
      };
    }
  }
}

// Create a singleton instance
const studentService = new StudentService();
export default studentService; 