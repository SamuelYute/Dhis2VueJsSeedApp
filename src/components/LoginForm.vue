<template>
    <form v-on:submit.prevent="authenticate">
        <div class="mb-4">
            <label for="username" class="block text-gray-darker text-sm font-bold mb-2">Username</label>
            <input v-model="authCredentials.username" id="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-darker" type="text" required/>
        </div>

        <div class="mb-10">
            <label for="password" class="block text-gray-darker text-sm font-bold mb-2">Password</label>
            <input v-model="authCredentials.password" id="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-darker" type="password" required/>
        </div>

        <div class="mb-4">
            <button type="submit" class="bg-teal-darker px-3 py-2 text-white rounded flex mx-auto">Login <font-awesome-icon icon="check" class="ml-1"/></button>
            <p v-if="isLoading" class="my-4 text-center">Authenticating with DHIS ...</p>
            <p v-if="authResponse.isAuthenticated" class="text-green my-4 text-center"><span class="font-bold">Login Successful!</span><br>Redirecting to Home...</p>
            <p v-if="authResponse.hasFailedAuthentication" class="text-red my-4 text-center"><span class="font-bold">Authentication Failed!</span><br>Check Auth Credentials</p>
        </div>
    </form>
</template>

<script>
    import  axios from 'axios'

    export default {
        name: 'LoginForm',
        methods: {
            authenticate : function ()
            {
                this.isLoading = true;
                this.authResponse.isAuthenticated = false;
                this.authResponse.hasFailedAuthentication = false;


                let requestConfig = this.prepareAuthRequestData();
                var authCredentialsEncoded = btoa(`${requestConfig.auth.username}:${requestConfig.auth.password}`);

                axios.get(this.BASE_URL, requestConfig)
                    .then(()=>{
                        this.isLoading = false;
                        this.authResponse.isAuthenticated = true;

                        sessionStorage.setItem('basicAuthToken', authCredentialsEncoded);

                        setTimeout(()=>{this.$router.push('/')},2000);
                    })
                    .catch(()=>{
                        this.isLoading = false;
                        this.authResponse.hasFailedAuthentication = true;

                        this.authCredentials.password = "";
                    })

            },

            prepareAuthRequestData : function()
            {
                return {
                    auth : {
                        username: this.authCredentials.username,
                        password: this.authCredentials.password
                    },
                }
            }
        },
        data: () => {
            return {
                BASE_URL : 'http://demo.dhis.org/dhis-web-commons/security/login.action',

                isLoading : false,

                authCredentials: {
                    username: "",
                    password: ""
                },

                authResponse : {
                    isAuthenticated: false,
                    hasFailedAuthentication : false
                }
            }
        }
    }
</script>
