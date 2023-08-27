// Libraries
//import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
// Components
import ListItem from "@/components/listItems/ListItem.vue";
// Utilities
import { mount, createLocalVue } from "@vue/test-utils";

// NOTE - console errors until vuetify 3.x: https://stackoverflow.com/questions/51990753/vue-js-vuetify-issue-running-my-first-unit-test-with-jest
// https://github.com/vuetifyjs/vuetify/issues/4964
describe("ListItem - Read Mode", () => {
  const localVue = createLocalVue();
  let wrapper;
  let objListItem;

  beforeEach(() => {
    localVue.use(Vuex);
    localVue.use(Vuetify);
    objListItem = {
      id: 10101,
      name: "Test Name",
      description: "Test Description summary text",
      sku: "1234567",
      price: 9.99,
      salePrice: 4.44,
      pricePerUnit: 1.18,
      url: null,
      imageUrl: null,
      isActive: true,
      createDate: null,
      updateDate: null,
      vendor: null,
      amountRemaining: 0,
      tags: ["Food"],
      groups: ["Costco"],
    };
    wrapper = mount(ListItem, {
      localVue,
      propsData: {
        item: objListItem,
      },
      mocks: {
        $store: {
          state: { selectionModeItems: [999, 16098] },
          dispatch: jest.fn(),
        },
      },
    });
  });

  it("should match snapshot", () => {
    // With jest we can create snapshot files of the HTML output
    expect(wrapper.html()).toMatchSnapshot();
  });
  it("should render the item name as title", () => {
    const selector = wrapper.find(".v-list-item__title");
    expect(selector.text()).toBe(objListItem.name);
  });
  it("should render the description as subtitle", () => {
    const selector = wrapper.find(".v-list-item__subtitle");
    expect(selector.text().trim()).toMatch(objListItem.description);
  });
  it("should render amount icon in default view", () => {
    //  With beforeEach assignment ( amountRemaining: 0 ) - the "empty" icon will be present. Need global CSS variables to test against
    const selector = wrapper.find(
      ".v-avatar.v-list-item__avatar > i.v-icon.notranslate.white.mdi.mdi-gauge-empty"
    );
    expect(selector.exists()).toBe(true);
  });
  //   it("should toggle amount icon to checkbox icon on click", () => {
  //     //const event = jest.fn();
  //     const selector = wrapper.find(".v-avatar.v-list-item__avatar ");
  //     // Simulate a click on the button
  //     selector.trigger("click");
  //     expect(selector.text().trim()).toMatch(objListItem.description);
  //   });
});
// div.v-avatar.v-list-item__avatar > i.v-icon.notranslate.white.mdi.mdi-gauge-low.theme--light.amber--text.text--darken-1
// div.v-avatar.v-list-item__avatar > i.v-icon.notranslate.white.mdi.mdi-gauge-empty.theme--light.red--text.text--darken-1
// div.v-avatar.v-list-item__avatar > i.v-icon.notranslate.white.mdi.mdi-gauge-full.theme--light.green--text

/*
TO-DO:
    Global CSS Values or app settings for testing CSS Variables/colors/icons
    Click Events will need a real store
    Shopping List Item view/behavior
    Test coverage results will most likely tank without supressing the "[Vuetify] Multiple instances of Vue detected" error 
*/
