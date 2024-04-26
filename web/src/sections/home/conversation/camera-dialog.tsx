import { Alert, Button, Dialog, IconButton, Stack, styled, Typography } from "@mui/material";
import '@tensorflow/tfjs-backend-webgl';
import * as handtrack from '@tensorflow-models/handpose';
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import Loader from "../../../components/loading/Loader";
import Webcam from 'react-webcam';
import * as fp from "fingerpose"
import { Signpass } from "../../../components/handimage";
import Handsigns from "../../../components/handsigns";
import { drawHand } from "../../../components/handposeutil";
import { Image } from '@nextui-org/image';
import { useAppContext } from "../../../services/app-context";
import { Clear, Send } from "@mui/icons-material";

interface CD {
    open: boolean;
    closeDialog: () => void;
}

const OverallContainer = styled('div')(() => ({
  height: '100vh',
  width: '100%',
  position: 'relative'
}))

const StyledCanvas = styled('canvas')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100vh',
  width: '100%',
  objectFit: 'cover',
  transform: 'scaleX(-1)'
}));

const StyledContent = styled('div')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100vh',
  width: '100%',
  zIndex: 100,
}));

const InfoDiv = styled('div')(() => ({
  borderRadius: '12px 12px 12px 0px',
  backgroundColor: '#FFF',
  width: 'fit-content',
  maxWidth: '50%'
}));

const TextContainer = styled('div')(() => ({
  padding: '12px',
  borderRadius: '12px',
  textAlign: 'center',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const SignImage = styled(Image)(() => ({
  height: '200px'
}))

const CameraDialog = ({ closeDialog, open }: CD) => {

  const { enqueueSnackbar } = useSnackbar();
  const { setMessageInput, sendMessage } = useAppContext();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [sign, setSign] = useState<any>(null);

  let signList: any = [];
  let theSign: any = null;

  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const shuffle = (a: any) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a;
  }

  const generateSigns = () => {
    const password = shuffle(Signpass);
    return password;
  }

  const _signList = () => {
    signList = generateSigns();
  }

  const loadModelHandler = async () => {
    try {
      enqueueSnackbar('Loading the model...')
      const model = await handtrack.load();
      enqueueSnackbar('Model Loaded', { variant: 'success' });
      setInterval(() => {
        detect(model);
      }, 1000)
    } catch (err: any) {
      console.log(err);
      const errorMessage = err?.message || err || 'Something went wrong';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoaded(true);
    }
  }

  const detect = async (net: any) => {
    try {
      if (typeof webcamRef?.current !== 'undefined' && webcamRef?.current !== null && webcamRef?.current?.video?.readyState === 4) {

        const video = webcamRef?.current?.video;
        const videoWidth = webcamRef?.current?.video?.videoWidth;
        const videoHeight = webcamRef?.current?.video?.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const hand = await net.estimateHands(video);

        if (hand.length > 0) {
          const GE = new fp.GestureEstimator([
            fp.Gestures.ThumbsUpGesture,
            Handsigns.aSign,
            Handsigns.bSign,
            Handsigns.cSign,
            Handsigns.dSign,
            Handsigns.eSign,
            Handsigns.fSign,
            Handsigns.gSign,
            Handsigns.hSign,
            Handsigns.iSign,
            Handsigns.jSign,
            Handsigns.kSign,
            Handsigns.lSign,
            Handsigns.mSign,
            Handsigns.nSign,
            Handsigns.oSign,
            Handsigns.pSign,
            Handsigns.qSign,
            Handsigns.rSign,
            Handsigns.sSign,
            Handsigns.tSign,
            Handsigns.uSign,
            Handsigns.vSign,
            Handsigns.wSign,
            Handsigns.xSign,
            Handsigns.ySign,
            Handsigns.zSign,
          ]);

          const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5);

          // console.log('Estimated Gestures', estimatedGestures)

          if (estimatedGestures.gestures !== undefined && estimatedGestures.gestures.length > 0) {
            const confidence = estimatedGestures.gestures.map(p => p.score);
            const maxConfidence = confidence.indexOf(Math.max.apply(undefined, confidence));
            const letterValue = estimatedGestures.gestures[maxConfidence].name;
            console.log(letterValue)
            _signList();
            if (letterValue !== 'thumbs_up') {
              const foundItemInList = signList.find((each: any) => each?.alt?.toLowerCase() === letterValue?.toLowerCase());
              if (foundItemInList) {
                setSign(foundItemInList);
                theSign = foundItemInList
              };
            } else if (letterValue === 'thumbs_up') {
              console.log('Confirming')
              console.log('Selected Sign',sign, theSign);
              if (!!theSign === true && !!theSign.alt === true) {
                if (typeof theSign?.alt === 'undefined') return;
                setText((prev: any) => (`${prev}${theSign?.alt}`));
                enqueueSnackbar('The detected letter has been appended to your text', { variant: 'success' });
                setSign(null);
                theSign = null;
              }
            }
          }

        }
        const ctx = canvasRef.current.getContext('2d');
        drawHand(hand, ctx);
      }
    } catch (err: any) {
      console.log(err);
      const errorMessage = err?.message || err || 'Something went wrong';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } 
  }

  const clearHandler = () => {
    setText(prev => prev.slice(0, prev.length - 1));
  }

  const sendHandler = () => {
    sendMessage();
    closeDialog();
  }

  useEffect(() => {
    setMessageInput(text);
  }, [text])

  useEffect(() => {
    loadModelHandler();
  }, [])

  return (
    <Dialog open={open} onClose={closeDialog} fullScreen>

      {!isLoaded && <Stack gap={1} sx={{ p: 3 }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <div />
          <Button onClick={closeDialog} variant="contained">Close</Button>
        </Stack>
        <Loader />
      </Stack>}

      {isLoaded && <OverallContainer>
        <Webcam style={{ height: '100%', width: '100vw', objectFit: 'cover', transform: 'scaleX(-1)' }} ref={webcamRef} />
        <StyledCanvas ref={canvasRef} />
        <StyledContent>
          <Stack sx={{ p: 3, height: '100%', width: '100%' }} gap={1} justifyContent='space-between'>

            <Stack direction='row' gap={1} alignItems='center' justifyContent='space-between'>
              <div />
              <Button onClick={closeDialog} variant="contained">Close</Button>
            </Stack>

            <Stack sx={{ flex: 1 }} gap={2} alignItems='center' justifyContent='center'>
              <Typography variant='h4' textAlign='center' fontWeight='600' >Detected Gesture</Typography>
              {sign && <SignImage src={sign?.src} alt={sign?.alt} />}
            </Stack>

            {text?.length > 0 && <TextContainer>
              <Typography>{text}</Typography>
              <Stack gap={1} direction='row' alignItems='center'>
                <IconButton onClick={clearHandler}><Clear /></IconButton>
                <IconButton onClick={sendHandler}><Send /></IconButton>
              </Stack>
            </TextContainer>}

            <Stack>
              <InfoDiv>
                <Alert severity='info'>Make any alphabetical sign and use the thumb sign to confirm</Alert>
              </InfoDiv>
            </Stack>
          </Stack>
        </StyledContent>
      </OverallContainer>}
    </Dialog>
  )
}

export default CameraDialog