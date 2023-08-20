import pygame
import sys

# Initialize Pygame
pygame.init()

# Constants
SCREEN_WIDTH = 300
SCREEN_HEIGHT = 300
CELL_SIZE = 100
BOARD_SIZE = 3
LINE_WIDTH = 5
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
BLUE = (0, 0, 255)

# Create the game window
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption('Tic-Tac-Toe')

def draw_board(board):
    for row in range(BOARD_SIZE):
        for col in range(BOARD_SIZE):
            x = col * CELL_SIZE
            y = row * CELL_SIZE
            pygame.draw.rect(screen, WHITE, pygame.Rect(x, y, CELL_SIZE, CELL_SIZE), LINE_WIDTH)

            if board[row][col] == 'X':
                pygame.draw.line(screen, RED, (x + 10, y + 10), (x + CELL_SIZE - 10, y + CELL_SIZE - 10), LINE_WIDTH)
                pygame.draw.line(screen, RED, (x + CELL_SIZE - 10, y + 10), (x + 10, y + CELL_SIZE - 10), LINE_WIDTH)
            elif board[row][col] == 'O':
                pygame.draw.circle(screen, BLUE, (x + CELL_SIZE // 2, y + CELL_SIZE // 2), CELL_SIZE // 2 - 10, LINE_WIDTH)

def check_winner(board, player):
    for i in range(BOARD_SIZE):
        if all(board[i][j] == player for j in range(BOARD_SIZE)):
            return True
        if all(board[j][i] == player for j in range(BOARD_SIZE)):
            return True

    if all(board[i][i] == player for i in range(BOARD_SIZE)):
        return True

    if all(board[i][BOARD_SIZE - 1 - i] == player for i in range(BOARD_SIZE)):
        return True

    return False

def is_board_full(board):
    return all(board[i][j] != ' ' for i in range(BOARD_SIZE) for j in range(BOARD_SIZE))

def main():
    board = [[' ' for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    players = ['X', 'O']
    current_player = 0

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if event.type == pygame.MOUSEBUTTONDOWN:
                x, y = pygame.mouse.get_pos()
                row = y // CELL_SIZE
                col = x // CELL_SIZE

                if board[row][col] == ' ':
                    board[row][col] = players[current_player]
                    current_player = (current_player + 1) % 2

        screen.fill(BLACK)
        draw_board(board)
        pygame.display.flip()

        if check_winner(board, 'X'):
            print("Player X wins!")
            pygame.time.wait(1000)
            break

        if check_winner(board, 'O'):
            print("Player O wins!")
            pygame.time.wait(1000)
            break

        if is_board_full(board):
            print("It's a draw!")
            pygame.time.wait(1000)
            break

if __name__ == '__main__':
    main()
