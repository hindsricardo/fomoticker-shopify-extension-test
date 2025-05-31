import { describe, it, expect, beforeEach } from 'vitest'

describe('Liquid Template Schema Validation', () => {
  let liquidContent: string

  beforeEach(async () => {
    const { readFileSync } = await import('fs')
    const { resolve } = await import('path')
    liquidContent = readFileSync(resolve('./blocks/fomo-ticker-embed.liquid'), 'utf-8')
  })

  describe('Template Structure', () => {
    it('should contain conditional rendering block', () => {
      expect(liquidContent).toContain('{%- if block.settings.enabled -%}')
      expect(liquidContent).toContain('{%- endif -%}')
    })

    it('should include fomo-ticker custom element', () => {
      expect(liquidContent).toContain('<fomo-ticker')
      expect(liquidContent).toContain('</fomo-ticker>')
    })

    it('should pass all required data attributes', () => {
      expect(liquidContent).toContain('data-text-color="{{ block.settings.text_color }}"')
      expect(liquidContent).toContain('data-background-color="{{ block.settings.background_color }}"')
      expect(liquidContent).toContain('data-border-color="{{ block.settings.border_color }}"')
      expect(liquidContent).toContain('data-text-size="{{ block.settings.text_size }}"')
      expect(liquidContent).toContain('data-height="{{ block.settings.height }}"')
      expect(liquidContent).toContain('data-speed="{{ block.settings.speed }}"')
      expect(liquidContent).toContain('data-position="{{ block.settings.position }}"')
      expect(liquidContent).toContain('data-block-id="{{ block.id }}"')
    })
  })

  describe('Schema Validation', () => {
    let schema: any

    beforeEach(() => {
      const schemaMatch = liquidContent.match(/{% schema %}\s*(\{[\s\S]*?\})\s*{% endschema %}/);
      expect(schemaMatch).toBeTruthy()
      
      schema = JSON.parse(schemaMatch![1])
    })

    it('should have correct extension metadata', () => {
      expect(schema.name).toBe('Fomo Notification Ticker')
      expect(schema.target).toBe('body')
      expect(schema.stylesheet).toBe('fomo-ticker.css')
      expect(schema.javascript).toBe('fomo-ticker.js')
    })

    it('should include all required settings', () => {
      const settingIds = schema.settings.map((s: any) => s.id)
      
      expect(settingIds).toContain('enabled')
      expect(settingIds).toContain('text_color')
      expect(settingIds).toContain('background_color')
      expect(settingIds).toContain('border_color')
      expect(settingIds).toContain('text_size')
      expect(settingIds).toContain('height')
      expect(settingIds).toContain('speed')
      expect(settingIds).toContain('position')
    })

    it('should have correct setting types', () => {
      const settings = schema.settings.reduce((acc: any, setting: any) => {
        acc[setting.id] = setting
        return acc
      }, {})

      expect(settings.enabled.type).toBe('checkbox')
      expect(settings.text_color.type).toBe('color')
      expect(settings.background_color.type).toBe('color')
      expect(settings.border_color.type).toBe('color')
      expect(settings.text_size.type).toBe('text')
      expect(settings.height.type).toBe('text')
      expect(settings.speed.type).toBe('number')
      expect(settings.position.type).toBe('select')
    })

    it('should have correct default values', () => {
      const settings = schema.settings.reduce((acc: any, setting: any) => {
        acc[setting.id] = setting
        return acc
      }, {})

      expect(settings.enabled.default).toBe(true)
      expect(settings.text_color.default).toBe('#ffffff')
      expect(settings.background_color.default).toBe('#ff6b35')
      expect(settings.border_color.default).toBe('#e55a2b')
      expect(settings.text_size.default).toBe('14px')
      expect(settings.height.default).toBe('48px')
      expect(settings.speed.default).toBe(50)
      expect(settings.position.default).toBe('header')
    })

    it('should have position select options', () => {
      const positionSetting = schema.settings.find((s: any) => s.id === 'position')
      
      expect(positionSetting.options).toHaveLength(2)
      expect(positionSetting.options[0].value).toBe('header')
      expect(positionSetting.options[0].label).toBe('Below Header')
      expect(positionSetting.options[1].value).toBe('footer')
      expect(positionSetting.options[1].label).toBe('Above Footer')
    })

    it('should have descriptive labels for all settings', () => {
      schema.settings.forEach((setting: any) => {
        expect(setting.label).toBeDefined()
        expect(setting.label.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Shopify Extension Compliance', () => {
    it('should be valid JSON schema', () => {
      const schemaMatch = liquidContent.match(/{% schema %}\s*(\{[\s\S]*?\})\s*{% endschema %}/);
      expect(schemaMatch).toBeTruthy()
      
      expect(() => JSON.parse(schemaMatch![1])).not.toThrow()
    })

    it('should use proper Liquid syntax', () => {
      expect(liquidContent).toMatch(/{%-?\s*if\s+.*?\s*-?%}/g)
      expect(liquidContent).toMatch(/{%-?\s*endif\s*-?%}/g)
      expect(liquidContent).toMatch(/{% schema %}/g)
      expect(liquidContent).toMatch(/{% endschema %}/g)
    })

    it('should use block.settings for all dynamic values', () => {
      const dynamicValues = liquidContent.match(/{{.*?}}/g) || []
      
      dynamicValues.forEach(value => {
        expect(value).toMatch(/block\.(settings|id)/)
      })
    })
  })
})
