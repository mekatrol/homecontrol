import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import SidebarSlider from '../SidebarSlider.vue';

describe('SidebarSlider', () => {
  it('renders properly', () => {
    const wrapper = mount(SidebarSlider, { props: { msg: 'hello' } });
    expect(wrapper.text()).toContain('hello');
  });
});
