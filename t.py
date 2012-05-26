#! /usr/bin/env python
# -*- coding: utf-8 -*-

import sys
from itertools import product

# 棋盘
class Board(object):

    def __init__(self, width, height):
        # 宽度
        self.width = width
        # 高度
        self.height = height
        # 全部坐标
        self.board = dict.fromkeys(product(xrange(width), xrange(height)))
        # 一盘棋所有步骤
        self.action = []
        # 黑棋
        self.black = BlackState(self)
        # 白棋
        self.white = WhiteState(self)
        # 当前轮到谁
        self.state = self.black
        # 前一步棋的坐标
        self.previous = None
        # 前一步轮到谁
        self.privious_state = None

    # 黑棋下
    def pointBlack(self, x, y):
        # 非法坐标
        if x < 0 or x >= self.width or y < 0 or y >= self.height:
            raise RuntimeError('the point out of range')
        # 坐标未用
        if self.board[(x, y)] is None:
            # 黑棋置为1
            self.board[(x, y)] = 1
            # 记录操作
            self.action.append({'name' : self.state.name, 'location' : (x, y)})
        else:
            raise RuntimeError('the point alreay exist')
        # 记录前一步
        self.previous = (x, y)
        self.previous_state = self.black

    # 白棋下
    def pointWhite(self, x, y):
        # 非法坐标
        if x < 0 or x >= self.width or y < 0 or y >= self.height:
            raise RuntimeError('the point out of range')
        # 坐标未用
        if self.board[(x, y)] is None:
            # 白棋置为0
            self.board[(x, y)] = 0
            # 记录操作
            self.action.append({'name' : self.state.name, 'location' : (x, y)})
        else:
            raise RuntimeError('the point alreay exist')
        # 记录前一步
        self.previous = (x, y)
        self.previous_state = self.white

    # 开始下棋
    def start(self):
        # 是否结束
        while (self.checkGameOver() is False):
            # 棋盘状态
            self.show()
            # 轮到谁下
            self.state.show()
            # 下棋
            self.state.point()

        # 产生赢家
        print '%s win!' % (self.previous_state.name)
        self.show()
        print self.action

    # 检查是否结束
    def checkGameOver(self):
        slash = set()
        # 检查横向
        for y in xrange(self.height):
            arr = list()
            for x in xrange(self.width):
                now = self.board[(x, y)]
                if now is not None:
                    arr.append(now)
                else:
                    arr.append(3)
            s = ''.join(['%d' % (a) for a in arr])
            slash.add(s)
        for item in slash:
            if '11111' in item or '00000' in item:
                return True
        slash.clear()
        # 检查竖向
        for x in xrange(self.width):
            arr = list()
            for y in xrange(self.height):
                now = self.board[(x, y)]
                if now is not None:
                    arr.append(now)
                else:
                    arr.append(3)
            s = ''.join(['%d' % (a) for a in arr])
            slash.add(s)
        for item in slash:
            if '11111' in item or '00000' in item:
                return True
        slash.clear()
        # 检查斜向
        for y in (0, self.height - 1):
            for x in xrange(self.width):
                # 两个方向
                arr = list()
                # 斜线方向
                now = self.board[(x, y)]
                if now is not None:
                    arr.append(now)
                else:
                    arr.append(3)
                for t in xrange(1, self.height):
                    m, n = x + t, y - t
                    if 0 <= m < self.width and 0 <= n < self.height:
                        now = self.board[(m, n)]
                        if now is not None:
                            arr.append(now)
                        else:
                            arr.append(3)
                    m, n = x - t, y + t
                    if 0 <= m < self.width and 0 <= n < self.height:
                        now = self.board[(m, n)]
                        if now is not None:
                            arr.append(now)
                        else:
                            arr.append(3)
                s = ''.join(['%d' % (a) for a in arr])
                slash.add(s)
                del arr[:]
                # 反斜线方向
                now = self.board[(x, y)]
                if now is not None:
                    arr.append(now)
                else:
                    arr.append(3)
                for t in xrange(1, self.height):
                    m, n = x + t, y + t
                    if 0 <= m < self.width and 0 <= n < self.height:
                        now = self.board[(m, n)]
                        if now is not None:
                            arr.append(now)
                        else:
                            arr.append(3)
                    m, n = x - t, y - t
                    if 0 <= m < self.width and 0 <= n < self.height:
                        now = self.board[(m, n)]
                        if now is not None:
                            arr.append(now)
                        else:
                            arr.append(3)
                s = ''.join(['%d' % (a) for a in arr])
                slash.add(s)
                del arr[:]
        for item in slash:
            if '11111' in item or '00000' in item:
                return True
        return False

    # 显示棋盘
    def show(self):
        for y in xrange(self.height):
            for x in xrange(self.width):
                if self.board[(x, y)] is not None:
                    if self.board[(x, y)] == 1:
                        sys.stdout.write('|*')
                    else:
                        sys.stdout.write('|@')
                else:
                    sys.stdout.write('|_')
            sys.stdout.write('|\n')

class GameState(object):

    def __init__(self, context):
        self.context = context

    def point(self):
        pass

    def show(self):
        print '%s thinking...' % (self.name)

class BlackState(GameState):

    def __init__(self, context):
        super(BlackState, self).__init__(context)
        self.name = 'Black'

    def point(self):
        # 等待输入
        try:
            x = int(raw_input("please input x coord: "))
            y = int(raw_input("please input y coord: "))
            self.context.pointBlack(x, y)
        except ValueError, e:
            print 'input invalid'
        except RuntimeError, e:
            print e
        else:
            self.context.state = self.context.white

class WhiteState(GameState):

    def __init__(self, context):
        super(WhiteState, self).__init__(context)
        self.name = 'White'

    def point(self):
        # 等待输入
        try:
            x = int(raw_input("please input x coord: "))
            y = int(raw_input("please input y coord: "))
            self.context.pointWhite(x, y)
        except ValueError, e:
            print 'input invalid'
        except RuntimeError, e:
            print e
        else:
            self.context.state = self.context.black

def main():
    board = Board(18, 18)
    board.start()

if __name__ == '__main__':
    main()
