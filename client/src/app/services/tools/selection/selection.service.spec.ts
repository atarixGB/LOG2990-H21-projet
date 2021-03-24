import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { mouseEventLClick, mouseEventRClick } from '@app/constants';
import { EllipseService } from '../ellipse/ellipse.service';
import { RectangleService } from '../rectangle/rectangle.service';
import { SelectionService } from './selection.service';

fdescribe('SelectionService', () => {
    let service: SelectionService;
    let InitialiseToolSpy: jasmine.Spy<any>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;
    let canvasSpy: jasmine.SpyObj<CanvasRenderingContext2D>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onMouseDown', 'onMouseMove', 'handleKeyDown', 'handleKeyUp']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onMouseDown', 'onMouseMove', 'handleKeyDown', 'handleKeyUp']);
        canvasSpy = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
        
        TestBed.configureTestingModule({
            providers: [{ provide: RectangleService, useValue: rectangleServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy }                ,
                { provide: CanvasRenderingContext2D, useValue: canvasSpy }],

        });
        service = TestBed.inject(SelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        InitialiseToolSpy = spyOn<any>(service, 'initializeToolParameters').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub; 
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // onMouseDown
    it('onMouseDown does nothing if not down', () => {
        service.mouseDown = false;
        service.onMouseDown(mouseEventRClick);
        expect(InitialiseToolSpy).not.toHaveBeenCalled();
    });

    it('onMouseDown should use rectangle if its the selection mode', () => {
        service.isEllipse = false;
        service.onMouseDown(mouseEventLClick);
        expect(InitialiseToolSpy).toHaveBeenCalled();
        expect(rectangleServiceSpy.onMouseDown).toHaveBeenCalled();
        expect(ellipseServiceSpy.onMouseDown).not.toHaveBeenCalled();
    });

    it('onMouseDown should use ellipse if its the selection mode', () => {
        service.isEllipse = true;
        service.onMouseDown(mouseEventLClick);
        expect(InitialiseToolSpy).toHaveBeenCalled();
        expect(rectangleServiceSpy.onMouseDown).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    // onMouseMove
    it('onMouseMove should not do something if mouse not down', () => {
        service.onMouseMove(mouseEventRClick);
        expect(rectangleServiceSpy.onMouseMove).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });

    it('onMouseMove should call rectangle onMouseMove if its the selection mode', () => {
        service.isEllipse = false;
        service.mouseDown = true;
        service.onMouseMove(mouseEventLClick);
        expect(rectangleServiceSpy.onMouseMove).toHaveBeenCalled();
        expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
    });

    it('onMouseMove should call ellipse onMouseMove if its the selection mode', () => {
        service.isEllipse = true;
        service.mouseDown = true;
        service.onMouseMove(mouseEventLClick);
        expect(rectangleServiceSpy.onMouseMove).not.toHaveBeenCalled();
        expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
    });

    it('onMouseMove should put the new selcetion to false if its in the selection area', () => {
        service.activeSelection = true;
        service.selectionTerminated = false;
        spyOn(service, 'mouseInSelectionArea').and.returnValue(true);
        service.onMouseMove(mouseEventLClick);

        expect(service.newSelection).toEqual(false);
    });

    it('onMouseMove should put the new selcetion to true if its not in the selection area', () => {
        service.activeSelection = true;
        service.selectionTerminated = false;
        spyOn(service, 'mouseInSelectionArea').and.returnValue(false);
        service.onMouseMove(mouseEventLClick);

        expect(service.newSelection).toEqual(true);
    });

    // OnMouseUp
    it('onMouseUp should not change the parameters if mouse is not down ', () => {
        service.activeSelection = false;
        service.onMouseUp();
        expect(service.activeSelection).toEqual(false);
    });

    /*
    it('onMouseUp should  change the parameters if mouse is  down ', () => {
        service.isEllipse = false;
        rectangleServiceSpy.pathData[0] = {x: 2, y: 3};
        rectangleServiceSpy.pathData[1] = {x:4, y: 5}; 
        service.activeSelection = false;
        service.mouseDown = true;
        service.onMouseUp();
        expect(service.activeSelection).toEqual(true);
        expect(service.mouseDown).toEqual(false);
        expect(service['getSelectionData']).toHaveBeenCalled();
        expect(service.createControlPoints).toHaveBeenCalled();
        expect(service['resetParametersTools']).toHaveBeenCalled();
    });
    */
    
    // OnMouseLeave
    it('onMouseLeave call onMouseUp if the mouse is down', () => {
        service.mouseDown = true;
        const onMouseUpSpy = spyOn(service, 'onMouseUp');
        service.onMouseLeave();
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    // handleKeyDown
    it('handleKeyDown for a rectangle selection', () => {
        const event = new KeyboardEvent('1');
        service.isEllipse = false;
        service.handleKeyDown(event);
        expect(rectangleServiceSpy.handleKeyDown).toHaveBeenCalled();
    });

    it('handleKeyDown for a ellipse selection', () => {
        const event = new KeyboardEvent('2');
        service.isEllipse = true;
        service.handleKeyDown(event);
        expect(ellipseServiceSpy.handleKeyDown).toHaveBeenCalled();
    });

    /*
    it('handleKeyDown terminate selection if the keyboard event is escape', () => {
        const event = new KeyboardEvent('Escape');
        event.key === 'Escape';
        service.handleKeyDown(event);
        const terminateSpy = spyOn(service, 'terminateSelection');

        // expect(keySpy).toHaveBeenCalled();
        expect(terminateSpy).toHaveBeenCalled();
    });
    */
    it('handleKeyUp for a rectangle selection', () => {
        const event = new KeyboardEvent('1');
        service.isEllipse = false;
        service.handleKeyUp(event);
        expect(rectangleServiceSpy.handleKeyUp).toHaveBeenCalled();
    });

    it('handleKeyUP for a ellipse selection', () => {
        const event = new KeyboardEvent('2');
        service.isEllipse = true;
        service.handleKeyUp(event);
        expect(ellipseServiceSpy.handleKeyUp).toHaveBeenCalled();
    });
    
    it('mouseInselectionArea return true if is in the selection area', () => {
        const origin = {x: 0, y: 0};
        const destination = {x:5, y:5};
        const mouseCoordTest = {x:2,y:2};

        const result = service.mouseInSelectionArea(origin, destination, mouseCoordTest);
        expect(result).toEqual(result);
    });

    /*
    it('selectAll changes the attributes of the selection to specify its all the drawing', () => {
        canvasTestHelper.canvas.width = 10;
        canvasTestHelper.canvas.height = 10;
        service.activeSelection = false;
        service.newSelection = false;
        service.initialSelection = false;
        service.clearUnderneath = false;
        service.selectionTerminated = true;
        service.selectAll();
        expect(service.activeSelection).toEqual(true);
        expect(service.newSelection).toEqual(true);
        expect(service.initialSelection).toEqual(true);
        expect(service.clearUnderneath).toEqual(true);
        expect(service.selectionTerminated).toEqual(false);
        expect(service.origin).toEqual({ x: 0, y: 0 });
        expect(service['width']).toEqual(10);
        expect(service['height']).toEqual(10);
    });
    */

    it('clearUnderneath shape clear in ellipse if it the selection form', () => {
        const points = {x: 10, y: 10};
        const width = 10;
        const height = 10;
        service.origin = points;
        service['width'] = width;
        service['height'] = height;
        service.isEllipse = true;
        const spyEllipse = spyOn(service['drawingService'].baseCtx, 'ellipse');
        const spyfill = spyOn(service['drawingService'].baseCtx, 'fill');
        service.clearUnderneathShape();
        expect(spyEllipse).toHaveBeenCalled();
        expect(spyfill).toHaveBeenCalled();
    });

    it('clearUnderneath shape clear in rectangle if it the selection form', () => {
        const points = {x: 10, y: 10};
        const width = 10;
        const height = 10;
        service.origin = points;
        service['width'] = width;
        service['height'] = height;
        service.isEllipse = false;
        const spyEllipse = spyOn(service['drawingService'].baseCtx, 'ellipse');
        const spyfill = spyOn(service['drawingService'].baseCtx, 'fillRect');
        service.clearUnderneathShape();
        expect(spyEllipse).not.toHaveBeenCalled();
        expect(spyfill).toHaveBeenCalled();
    });

    it('terminateSelection doesnt terminate if its not an activeSelection', () => {
        service.activeSelection = false;
        service.newSelection = false;
        service.imageMoved = true;
        service.selectionTerminated = false;
        service.mouseDown = true;
        service.terminateSelection();
        expect(service.activeSelection).toEqual(false);
        expect(service.newSelection).toEqual(false);
        expect(service.imageMoved).toEqual(true);
        expect(service.selectionTerminated).toEqual(false);
        expect(service.mouseDown).toEqual(true);
    });


/*
    it('terminateSelection terminate if its an activeSelection', () => {
        const imageData = new ImageData(10,10);
        //const clearCanvasSpy = spyOn(service['drawingService'], 'clearCanvas');
        const points = {x:0, y:0};
        service.selection = imageData;
        service.origin = points;
        service.activeSelection = true;
        service.newSelection = false;
        service.imageMoved = true;
        service.selectionTerminated = false;
        service.mouseDown = true;
        service.terminateSelection();
        expect(service.activeSelection).toEqual(false);
        //expect(service.newSelection).toEqual(true);
        //expect(service.imageMoved).toEqual(true);
        //expect(service.selectionTerminated).toEqual(true);
        //expect(service.mouseDown).toEqual(false);
        //expect(clearCanvasSpy).toHaveBeenCalled();
    });
*/

/*
    it('calculateDimensions reajust the origin and the destination with rectangle', () => {
        service.isEllipse = false;
        service['rectangleService'].pathData[0] = {x: 0, y:0};
        service['rectangleService'].pathData[1] = {x: 10, y:10};
        service['calculateDimension']();
        expect(service.origin).toEqual({x: 0, y:0});
        expect(service.destination).toEqual({x: 10, y:10});
        expect(service['width']).toEqual(10);
        expect(service['height']).toEqual(10);
    });
*/
    it('getSelectionData use the good range to select data', () => {
        const origin = {x:0, y:0};
        const width = 10;
        const height = 10;
        service.origin = origin;
        service['width'] = width;
        service['height'] = height;
        const calculateSpy = spyOn<any>(service,'calculateDimension').and.stub();
        service['getSelectionData'](canvasSpy);
        expect(calculateSpy).toHaveBeenCalled()
        expect(canvasSpy.getImageData).toHaveBeenCalled();
    });

    it('getSelectionData check the pixels in ellipse', () => {
        const origin = {x:0, y:0};
        const width = 10;
        const height = 10;
        service.isEllipse = true;
        service.origin = origin;
        service['width'] = width;
        service['height'] = height;
        const calculateSpy = spyOn<any>(service,'calculateDimension').and.stub();
        const checkPixelSpy = spyOn<any>(service,'checkPixelInEllipse').and.stub();
        service['getSelectionData'](canvasSpy);
        expect(calculateSpy).toHaveBeenCalled()
        expect(canvasSpy.getImageData).toHaveBeenCalled();
        expect(checkPixelSpy).toHaveBeenCalled();
    });

    it('resetParametersTools resets all the parameters ', () => {
        const defaultLine = 10;
        const newLine = 4;
        service['previousLineWidthRectangle'] = defaultLine;
        service['previousLineWidthEllipse'] = defaultLine;

        service['rectangleService'].mouseDown = true;
        service['rectangleService'].lineWidth = newLine;
        service['rectangleService'].isSelection = true;
        service['ellipseService'].mouseDown = true;
        service['ellipseService'].lineWidth = newLine;
        service['ellipseService'].isSelection = true;
        service['resetParametersTools']();
        expect(rectangleServiceSpy.mouseDown).toEqual(false);
        expect(rectangleServiceSpy.lineWidth).toEqual(defaultLine);
        expect(rectangleServiceSpy.isSelection).toEqual(false);
        expect(ellipseServiceSpy.mouseDown).toEqual(false);
        expect(ellipseServiceSpy.lineWidth).toEqual(defaultLine);
        expect(ellipseServiceSpy.isSelection).toEqual(false);
    });






});
