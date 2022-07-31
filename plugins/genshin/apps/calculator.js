import plugin from '../../../lib/plugins/plugin.js'
import Calculator from '../model/calculator.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
import gsCfg from '../model/gsCfg.js'

export class calculator extends plugin {
  constructor () {
    super({
      name: '刻晴养成',
      dsc: '角色养成材料计算器',
      event: 'message',
      priority: 700,
      rule: [
        {
          reg: '^#*(.*)(养成|计算)([0-9]|,|，| )*$',
          fnc: 'Calculator'
        },
        {
          reg: '^#*角色(养成|计算|养成计算)$',
          fnc: 'calculatorHelp'
        }
      ]
    })
  }

  async calculatorHelp (e) {
    let msg = '#角色养成计算\n指令：#刻晴养成\n示例：#刻晴养成81 90 9 9 9\n参数为角色、武器、技能等级'
    await e.reply(msg)
    return true
  }

  /** #刻晴养成 */
  async Calculator () {
    let role = gsCfg.getRole(this.e.msg, '#|＃|养成|计算|[0-9]|,|，| ')
    if (!role) return false

    if ([10000005, 10000007, 20000000].includes(Number(role.roleId))) {
      await this.e.reply('暂不支持旅行者养成计算')
      return true
    }

    let data = await new Calculator(this.e).get(role)
    if (!data) return

    /** 生成图片 */
    let img = await puppeteer.screenshot('Calculator', data)
    if (img) await this.reply(img)
  }
}
