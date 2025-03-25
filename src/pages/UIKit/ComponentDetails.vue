<template>
  <v-expansion-panels>
    <v-expansion-panel v-if="!component.hidden" class="border_type-1 overflow">
      <v-expansion-panel-title>
        <v-code>{{
          component.defaultComponent
        }}</v-code>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <p class="mb-2">{{ component.description }}</p>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(attrGroup, index) in component.attributeGroups"
            class="border_type-1"
            :key="index"
          >
            <v-expansion-panel-title>{{
              attrGroup.groupTitle
            }}</v-expansion-panel-title>
            <v-expansion-panel-text>
              <p>{{ attrGroup.groupDescription }}</p>

              <div
                v-for="(attrItem, attrIndex) in attrGroup.attributes"
                :key="attrIndex"
              >
                <strong>{{ attrItem.value }}</strong>
                {{ attrItem.description ? "- " : "" }}
                {{ attrItem.description }}
                <pre><v-code lang="vuejs">{{ attrItem.example }}</v-code></pre>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "ComponentDetails",
  props: {
    component: Object,
  },
}
</script>
