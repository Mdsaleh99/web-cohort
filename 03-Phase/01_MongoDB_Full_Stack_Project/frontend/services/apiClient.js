// services ko hi bolte hai dependency injection

class ApiClinet{
    constructor() {
        this.baseUrl = "http://localhost:4000/api/v1"
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        }
    }

    // custom fetch method
    async customFetch(endpoint, options = {}) {
        try {
          const url = `${this.baseUrl}${endpoint}`;
          const headers = { ...this.defaultHeaders, ...options.headers };

          const config = {
            ...options,
            headers,
            credentials: "include",
          };
          console.log(`Fetching ${url}`);
          const response = await fetch(url, config);
          // check if response.ok === value
          const data = await response.json();

          return data;
        } catch (error) {
            console.error("Api Error", error);
            throw error
        }
    }

    async signup(name, email, password) {
        this.customFetch("/users/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });
    }

    async login(email, password) {
        this.customFetch("/users/login", {
            method: "POST",
            body: JSON.stringify({email, password})
        })
    }

    async getProfile() {
        return this.customFetch("/users/me")
    }

}

// single ton pattern
const apiClient = new ApiClinet()
export {apiClient}