import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Angular Pong'
  private gameBoardWidth: number = 0;
  private gameBoardHeight: number = 0;
  private paddleHeight: number = 0;
  private paddleWidth: number = 0;
  private paddleSpeed: number = 0;
  private ballSize: number = 0;
  private ballSpeedX: number = 0;
  private ballSpeedY: number = 0;
  private offset: number = 0;

  public playerScore: number = 0;
  public computerScore: number = 0;

  public playerY: number = 0;
  public computerY: number = 0;
  public ballX: number = 0;
  public ballY: number = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @ViewChild('gameBoardRef', { static: true })
  gameBoardRef!: ElementRef;

  initializeGameDimensions() {
    const styles = window.getComputedStyle(this.gameBoardRef.nativeElement);
    this.gameBoardWidth = parseInt(styles.getPropertyValue('--game-board-width'), 10);
    this.gameBoardHeight = parseInt(styles.getPropertyValue('--game-board-height'), 10);
    this.paddleHeight = parseInt(styles.getPropertyValue('--paddle-height'), 10);
    this.paddleWidth = parseInt(styles.getPropertyValue('--paddle-width'), 10);
    this.paddleSpeed = parseInt(styles.getPropertyValue('--paddle-speed'), 10);
    this.ballSize = parseInt(styles.getPropertyValue('--ball-size'), 10);
    this.ballSpeedX = parseInt(styles.getPropertyValue('--ball-speed-x'), 10);
    this.ballSpeedY = parseInt(styles.getPropertyValue('--ball-speed-y'), 10);
    this.offset = parseInt(styles.getPropertyValue('--offset'), 10);
  }

  ngOnInit() {
    this.initializeGameDimensions();
    this.initializeGame();
    this.handleMouseEvents();
  }
  
  
  handleMouseEvents() {
    const gameBoardElement = this.gameBoardRef.nativeElement;
  
    gameBoardElement.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = gameBoardElement.getBoundingClientRect();
      const mouseY = event.clientY - rect.top - this.paddleHeight / 2;
      const maxY = this.gameBoardHeight - this.paddleHeight;
  
      if (mouseY >= 0 && mouseY <= maxY) {
        this.playerY = mouseY;
      }
    });
  
    gameBoardElement.addEventListener('touchmove', (event: TouchEvent) => {
      event.preventDefault();
      const rect = gameBoardElement.getBoundingClientRect();
      const touchY = event.touches[0].clientY - rect.top - this.paddleHeight / 2;
      const maxY = this.gameBoardHeight - this.paddleHeight;
  
      if (touchY >= 0 && touchY <= maxY) {
        this.playerY = touchY;
      }
    });
  }
  ballSpeed: number = 5;
  

  initializeGame() {
    this.playerY = (this.gameBoardHeight - this.paddleHeight) / 2;
    this.computerY = (this.gameBoardHeight - this.paddleHeight) / 2;
    this.ballX = (this.gameBoardWidth - this.ballSize) / 2;
    this.ballY = (this.gameBoardHeight - this.ballSize) / 2;
    this.startGame();
    setInterval(() => {
      this.movePlayerPaddle();
      this.moveComputerPaddle();
      this.moveBall();
    }, 16);
  }
  startGame() {
    // Generate a random number between -1 and 1 for initial ball direction
    const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
    const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
  
    // Set initial ball speed and direction
    this.ballSpeedX = this.ballSpeed * randomDirectionX;
    this.ballSpeedY = this.ballSpeed * randomDirectionY;
  
    // Start the ball at the center of the game board
    this.ballX = (this.gameBoardWidth - this.ballSize) / 2;
    this.ballY = (this.gameBoardHeight - this.ballSize) / 2;
  }
  

  movePlayerPaddle() {
    const paddleElement = this.gameBoardRef.nativeElement.querySelector('.paddle.player');
    const maxY = this.gameBoardHeight - this.paddleHeight;
  
    if (this.playerY >= 0 && this.playerY <= maxY) {
      this.renderer.setStyle(paddleElement, 'top', `${this.playerY}px`);
    }
  }
  
  
  moveComputerPaddle() {
    const computerPaddle = this.gameBoardRef.nativeElement.querySelector('.paddle.computer');
    const computerPaddleCenter = this.computerY + this.paddleHeight / 2;
  
    if (computerPaddleCenter < this.ballY - this.paddleHeight / 4 && this.computerY + this.paddleSpeed < this.gameBoardHeight - this.paddleHeight) {
      this.computerY += this.paddleSpeed;
    } else if (computerPaddleCenter > this.ballY + this.paddleHeight / 4 && this.computerY - this.paddleSpeed > 0) {
      this.computerY -= this.paddleSpeed;
    }
  
    // Update the computer paddle's position
    this.renderer.setStyle(computerPaddle, 'top', `${this.computerY}px`);
  }
  
  
  
  
  moveBall() {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;
  
    if (this.ballX <= 0) {
      // Player scores a point
      this.computerScore++;
      this.resetBall();
    }
  
    if (this.ballX + this.ballSize > this.gameBoardWidth) {
      // Computer scores a point
      this.playerScore++;
      this.resetBall();
    }
  
    if (this.ballY <= 0 || this.ballY + this.ballSize >= this.gameBoardHeight) {
      // Reverse the ball's vertical speed to bounce off top and bottom edges
      this.ballSpeedY *= -1;
    }
  
    // Check for collision with player paddle
    const playerPaddle = this.gameBoardRef.nativeElement.querySelector('.paddle.player');
    if (
      this.ballY + this.ballSize >= this.playerY &&
      this.ballY <= this.playerY + this.paddleHeight &&
      this.ballX <= this.paddleWidth + 20
    ) {
      this.ballSpeedX *= -1;
      this.ballX = this.paddleWidth + 20; // Adjust the ball's position to prevent it from sticking to the paddle
    }
  
    // Check for collision with computer paddle
    // Check for collision with computer paddle
    // Check for collision with computer paddle
    const computerPaddle = this.gameBoardRef.nativeElement.querySelector('.paddle.computer');
    if (
      this.ballY + this.ballSize >= this.computerY &&
      this.ballY <= this.computerY + this.paddleHeight &&
      this.ballX >= this.gameBoardWidth - this.paddleWidth - this.offset
    ) {
      this.ballSpeedX *= -1;
      this.ballX = this.gameBoardWidth - this.paddleWidth - this.offset; // Adjust the ball's position to prevent it from sticking to the paddle
    }


  
    // Update the ball's position
    const ballElement = this.gameBoardRef.nativeElement.querySelector('.ball');
    this.renderer.setStyle(ballElement, 'left', `${this.ballX}px`);
    this.renderer.setStyle(ballElement, 'top', `${this.ballY}px`);
  }
  
  
  resetBall() {
    const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
    const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
  
    // Set initial ball speed and direction
    this.ballSpeedX = this.ballSpeed * randomDirectionX;
    this.ballSpeedY = this.ballSpeed * randomDirectionY;
  
    // Start the ball at the center of the game board
    this.ballX = (this.gameBoardWidth - this.ballSize) / 2;
    this.ballY = (this.gameBoardHeight - this.ballSize) / 2;
  }
  newGame(){
    this.computerScore = 0;
    this.playerScore = 0;
    const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
    const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
  
    // Set initial ball speed and direction
    this.ballSpeedX = this.ballSpeed * randomDirectionX;
    this.ballSpeedY = this.ballSpeed * randomDirectionY;
  
    // Start the ball at the center of the game board
    this.ballX = (this.gameBoardWidth - this.ballSize) / 2;
    this.ballY = (this.gameBoardHeight - this.ballSize) / 2;
  }
  
  

  @HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  if (event.key === 'ArrowUp' && this.playerY >= this.paddleSpeed) {
    this.playerY -= this.paddleSpeed;
  } else if (
    event.key === 'ArrowDown' &&
    this.playerY <= this.gameBoardHeight - this.paddleHeight - this.paddleSpeed
  ) {
    this.playerY += this.paddleSpeed;
  }
}

  
}
