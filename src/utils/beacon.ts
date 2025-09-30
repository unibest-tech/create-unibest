import fetch from 'node-fetch';
import dayjs from 'dayjs';
import os from 'os';
import crypto from 'crypto';
import packageJSON from '../../package.json';
import getUnibestVersion from './unibestVersion';

/**
 * 发送统计数据到服务器
 * @param template - 使用的模板名称
 * @param duration - 操作持续时间
 */
export async function beacon(template: string, duration: string) {
    try {
        const unibestVersion = await getUnibestVersion()
        const deviceIdentifier = generateDeviceIdentifier();

        await fetch('https://ukw0y1.laf.run/create-unibest/beacon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template,
                unibestVersion,
                createUnibestVersion: packageJSON.version,
                duration,
                time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                nodeVersion: process.version,
                osPlatform: process.platform,
                cpuModel: os.cpus()[0]?.model || 'unknown',
                osRelease: os.release(),
                totalMem: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // 四舍五入为整数 GB
                cpuArch: process.arch,
                uuid: deviceIdentifier // 添加设备唯一标识符
            })
        });

    } catch (error) {
        // 不需要打印
    }

}

/**
 * 生成设备唯一标识符
 * @returns 设备唯一标识符（SHA-256哈希）
 */
function generateDeviceIdentifier(): string {
    const deviceInfo = [
        os.cpus()[0]?.model || '',
        os.totalmem().toString(),
        os.platform(),
        os.userInfo().username,
    ].join('|');

    const hash = crypto.createHash('sha256').update(deviceInfo).digest('hex');
    return hash;
}