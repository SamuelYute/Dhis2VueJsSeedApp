<template>
    <div>
        <div class="row py-5">
            <div class="col-8 offset-2">
                <h1 class="text-center text-teal-darker font-light"> HIV Mobile Supervision Tool </h1>
            </div>
            <div class="col-2">
                <LogoutButton  />
            </div>
        </div>

        <div class="border-t border-yellow-darker mb-2"></div>

        <div class="container w-50 py-4">
                <DataElementGroupWrapper />
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import LogoutButton from '@/components/LogoutButton.vue'
import DataElementGroupWrapper from '@/components/DataElementGroupWrapper.vue'

export default {
  name: 'home',
  components: {
    LogoutButton,
    DataElementGroupWrapper
  }
}
</script>
