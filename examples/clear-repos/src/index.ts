import path from 'node:path'
import type { SimpleGit } from 'simple-git'
import { simpleGit } from 'simple-git'
import consola from 'consola'
import fs from 'fs-extra'

export async function checkRepositoryStatus(git: SimpleGit) {
  try {
    // 获取当前仓库的状态
    const status = await git.status()
    const rootDir = await git.revparse(['--show-toplevel'])

    // 检查是否有未提交的改动
    if (status.isClean()) {
      // consola.success('工作目录干净，没有待提交的内容。')
    }
    else {
      consola.warn(`工作目录 ${rootDir} 有待提交的内容。`)
    }
    // consola.warn('工作目录有待提交的内容:')
    // console.log('未跟踪的文件:', status.not_added)
    // console.log('修改的文件:', status.modified)
    // console.log('新建的文件:', status.created)
    // console.log('删除的文件:', status.deleted)
    // console.log('重命名的文件:', status.renamed)
  }
  catch (error) {
    consola.error('检查仓库状态时出错:', error)
  }
}

export async function checkRemoteSync(git: SimpleGit) {
  try {
    // 获取仓库状态
    const status = await git.status()
    const rootDir = await git.revparse(['--show-toplevel'])

    // 检查本地分支与远程分支的比较结果
    // consola.info('当前分支:', status.current)
    if (status.behind > 0)
      consola.warn(`${rootDir} 本地分支落后于远程分支 ${status.tracking} 的 ${status.behind} 个提交。`)

    if (status.ahead > 0)
      consola.warn(`${rootDir} 本地分支领先于远程分支 ${status.tracking} 的 ${status.ahead} 个提交。`)

    // if (status.ahead === 0 && status.behind === 0)
    //   consola.success('本地分支与远程分支同步。')
  }
  catch (error) {
    consola.error('检查远程同步状态时出错:', error)
  }
}

// checkRemoteSync()
// checkRepositoryStatus()

export async function checkFolder(dir: string) {
  const folders = await fs.readdir(dir, { withFileTypes: true })
  for (const folder of folders) {
    if (!folder.isDirectory())
      continue

    const baseDir = path.join(dir, folder.name)
    const git = simpleGit({
      baseDir,
    })
    const isRepo = await git.checkIsRepo().catch(() => false)

    if (isRepo) {
      await checkRepositoryStatus(git)
      await checkRemoteSync(git)
    }
    else {
      checkFolder(path.join(dir, folder.name))
    }
  }
}

async function main() {
  checkFolder('/Users/yunyou/repos')
}

main()
