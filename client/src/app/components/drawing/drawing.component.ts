import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { NewDrawModalComponent } from '@app/components/new-draw-modal/new-draw-modal.component';
import { MIN_HEIGHT, MIN_WIDTH } from '@app/constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/new-drawing/new-drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, AfterViewChecked, OnDestroy {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('workingArea', { static: false }) workingArea: ElementRef<HTMLDivElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private canvasSize: Vec2;
    subscription: Subscription;

    constructor(
        private drawingService: DrawingService,
        private toolManagerService: ToolManagerService,
        private cdr: ChangeDetectorRef,
        private newDrawingService: NewDrawingService,
        public dialog: MatDialog,
    ) {
        this.canvasSize = { x: MIN_WIDTH, y: MIN_HEIGHT };

        this.subscription = this.newDrawingService.getCleanStatus().subscribe((isCleanRequest) => {
            if (isCleanRequest) {
                this.drawingService.baseCtx.beginPath();
                this.drawingService.baseCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
                this.drawingService.previewCtx.clearRect(0, 0, this.canvasSize.x, this.canvasSize.y);
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.workingArea.nativeElement.style.width = '85vw';
        this.workingArea.nativeElement.style.height = '100vh';

        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
    }

    ngAfterViewChecked(): void {
        this.canvasSize = { x: this.workingArea.nativeElement.offsetWidth / 2, y: this.workingArea.nativeElement.offsetHeight / 2 };
        if (this.canvasSize.x < MIN_WIDTH || this.canvasSize.y < MIN_HEIGHT) {
            this.canvasSize = { x: MIN_WIDTH, y: MIN_HEIGHT };
        }
        this.cdr.detectChanges();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseMove(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseDown(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.mouseCoord = { x: event.offsetX, y: event.offsetY };
            this.toolManagerService.currentTool.onMouseUp(event);
        }
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.onMouseClick(event);
        }
    }

    @HostListener('dblclick', ['$event'])
    onMousonDoubleClick(event: MouseEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.onMouseDoubleClick(event);
        }
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent): void {
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.currentTool.handleKeyUp(event);
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolManagerService.currentTool != undefined) {
            this.toolManagerService.handleHotKeysShortcut(event);
        }
        if (event.ctrlKey && event.code === 'KeyO') {
            this.dialog.open(NewDrawModalComponent, {});
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
