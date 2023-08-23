import axios, { AxiosInstance } from 'axios';
import config from '../config'
import Cookies from "js-cookie";

const api: AxiosInstance = axios.create();



const SetCookie = (token: string) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 6 * 60 * 60 * 1000);
    Cookies.set("token", "Bearer ".concat(token), {
        expires: expirationDate,
    });
};

// Method to get data from cookies
export const GetCookie = () => {
    return Cookies.get("token") || false;
};

export const getDetails = async () => {
    if (!GetCookie()) {
        return false;
    }
    else {
        try {
            const res = await api.get(`${config.api}/userDetails`, {
                headers: {
                    'authorization': GetCookie()
                }
            });
            return res.data;
        }
        catch (error: any) {
            return error?.response?.status;
        }
    }

}

// Method to remove data from cookies
export const RemoveCookie = () => {
    Cookies.remove("token");
};

export const loginUser = async (email: string, password: string) => {
    try {
        const res = await api.post(`${config.api}/signin`, { email, password });
        // const resp = await api.get(`${config.api}/emails/send`);

        SetCookie(res.data[0]);
        return (res.data[1] === 'user');
    } catch (error: any) {
        return error?.response?.status;
    }
};

export const registerUser = async (firstName: string, lastName: string, email: string, phone: string, address: string, password: string) => {
    try {
        const res = await api.post(`${config.api}/register`, { firstName, lastName, email, phone, address, password });
        SetCookie(res.data[0]);
        return (res.data[1] === 'user');
    } catch (error: any) {
        console.log(error);
        return error?.response?.status;
    }
};

export const updateUserDetails = async (userDetails: any) => {
    try {
        const res = await api.put(`${config.api}/update`, { userDetails }, {
            headers: {
                'authorization': GetCookie()
            }
        });
        console.log(res.status, 'resstatus');

        return res.status;
    }
    catch (error: any) {
        console.log(error, 'error');

        return error?.response?.status;
    }
}


export const checkIsManager = async () => {
    try {
        const res = await api.get(`${config.api}/isManager`, {
            headers: {
                'authorization': GetCookie()
            }
        });
        return res.status;
    }
    catch (error: any) {
        return error?.response?.status;
    }
}
export const checkCreditDetails = async () => {
    try {
        const res = await api.get(`${config.api}/payment/check`, {
            headers: {
                'authorization': GetCookie()
            }
        });
        console.log(res, res.data);

        return res.data;
    }
    catch { }
}
export const addSubscribe = async (duration: string) => {
    try {
        const res = await api.post(`${config.api}/subscription/add`, { duration }, {
            headers: {
                'authorization': GetCookie()
            }
        });
        return res.data;
    }
    catch (error) {
        console.error(error)
    }
}

export const getPrice = async (duration: string) => {
    try {
        const res = await api.get(`${config.api}/subscription/price`, {
            params: {
                type: duration,
            },
            headers: {
                'authorization': GetCookie()
            }
        });
        console.log(res, res.data);

        return res.data;
    }
    catch (error: any) {
        console.log(error);
        return error?.response?.status;
    }
}
export const checkIsSubscribe = async () => {
    try {
        const res = await api.get(`${config.api}/subscription/check`, {
            headers: {
                'authorization': GetCookie()
            }
        });
        console.log(res, res.data);

        return res.data;
    }
    catch (error: any) {
        return error?.response?.status;
    }
}

export const addPaymentDetails = async (nameCard: string, cardNumber: string, expDate: Date, cvv: string) => {
    try {

        const res = await api.post(`${config.api}/payment`, { nameCard, cardNumber, expDate, cvv }, {
            headers: {
                'authorization': GetCookie()
            }
        });
        console.log(res);

        return res.data;
    }
    catch (error: any) {
        return error?.response?.status;
    }

}

export const getUsers = async () => {
    try {
        const res = await api.get(`${config.api}/users`, {
            headers: {
                authorization: GetCookie(),
            },
        });
        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
};

export const addCourse = async (TeacherName: string, NumberOfMeeting: number, CoursesType: any, Gender: any, StartDate: Date, EndDate: Date, duration: number, price: number, capacity: number) => {
    try {
        const res = await api.post(`${config.api}/course/add`, {
            TeacherName, NumberOfMeeting, Gender, CoursesType, StartDate, EndDate, duration, price, capacity
        }, {
            headers: {
                authorization: GetCookie(),
            },
        });
        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
};

export const getCoursesType = async () => {
    try {
        const res = await api.get(`${config.api}/course/getType`, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.data);

        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}
export const registerToCourse = async (courseId: string) => {
    try {
        const token = GetCookie(); // Assuming this function retrieves the authorization token
        const res = await axios.post(`${config.api}/enrollement/${courseId}`, {}, {
            headers: {
                authorization: token,
            },
        });

        return res.data.course.status;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}

export const getCourses = async () => {
    try {
        const res = await api.get(`${config.api}/course/get`);
        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}

export const getSchedule = async (date: Date) => {
    try {
        const res = await api.get(`${config.api}/schedule/get`, {
            params: {
                date: date.toISOString(), // Convert the date to ISO string format
            },
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.data);

        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
};




export const addComment = async (data: any) => {
    try {
        const res = await api.post(`${config.api}/comments/add`, { data }, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.data);

        return res.status;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}

export const updateComment = async (_id: any) => {
    try {
        const res = await api.put(`${config.api}/comments/${_id}`, null, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.status);

        return res.status;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}


export const getComments = async () => {
    try {
        const res = await api.get(`${config.api}/comments/get`, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.data);

        return [res.status, res.data];
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return [error?.response?.status];
    }
}


export const getSatisfaction = async () => {
    try {
        const res = await api.get(`${config.api}/satisfaction/get`, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res.data);

        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        if (error?.response?.status === undefined)
            return undefined;
        return error?.response?.status;
    }
}


export const checkSatisfaction = async () => {
    try {
        const res = await api.get(`${config.api}/satisfaction/check`, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log(res);

        return res.status;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        if (error?.response?.status === undefined)
            return undefined;
        return error?.response?.status;
    }
}

export const addSatisfaction = async (Service: number,
    Availability: number,
    Cleanly: number,
    lessons: number,
    Staff: number,) => {
    try {
        const res = await api.post(`${config.api}/satisfaction/add`, {
            Service,
            Availability,
            Cleanly,
            lessons,
            Staff,
        }, {
            headers: {
                authorization: GetCookie(),
            },
        });
        console.log("gggg:" + res.data);

        return res.data;
    } catch (error: any) {
        console.error('Error:', error);
        console.log('Response status:', error?.response?.status);
        return error?.response?.status;
    }
}