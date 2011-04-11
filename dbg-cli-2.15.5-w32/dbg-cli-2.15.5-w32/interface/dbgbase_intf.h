/***************************************************************************
                          dbgbase_intf.h  -  description
                             -------------------
    begin                : Fri Mar 2 2001
    copyright            : (C) 2001 by Dmitri Dmitrienko
                         : (C) 2002, 2004 NuSphere Corp.
    www                  : http://dd.cron.ru
                         : http://www.nusphere.com/
    license              : This source file is subject to version 1.01 of 
                           the License,  that is bundled with this package 
                           in the file LICENSE, and is available at through 
                           the world-wide-web at http://dd.cron.ru/license
 ***************************************************************************/

#ifndef _DBGBASE_INTF_H_
#define _DBGBASE_INTF_H_


typedef enum tagBR_REASON {
    BR_UNKNOWN		= 0x0000,	// 
    BR_STEPINTO     = 0x0001,	// Caused by the stepping mode
    BR_STEPOVER     = 0x0002,	// Caused by the stepping mode
    BR_STEPOUT      = 0x0003,	// Caused by the stepping mode
    BR_BREAKPOINT   = 0x0004,	// Caused by an explicit breakpoint
    BR_EMBEDDED     = 0x0005,	// Caused by a scripted break e.g. DebugBreak()
    BR_DEBUGGER_REQ = 0x0006,	// Caused by debugger IDE requested break e.g. "Pause"
    BR_START_SESSION= 0x1007,	// Pseudo breakpoint
    BR_END_SESSION  = 0x1008	// Pseudo breakpoint
} BR_REASON;

const long	ERR_ERROR		= 0x01;
const long	ERR_WARNING		= 0x02;
const long	ERR_PARSE		= 0x04;
const long	ERR_NOTICE		= 0x08;
const long	ERR_CORE_ERROR		= 0x10;
const long	ERR_CORE_WARNING	= 0x20;
			
		
typedef enum tagBP_ACTION{
    BP_ABORT = 0,		// Abort the application
    BP_CONTINUE = 1,	// Continue running
    BP_STEP_INTO = 2,	// Step into a procedure
    BP_STEP_OVER = 3,	// Step over a procedure
    BP_STEP_OUT = 4,		// Step out of the current procedure
    BP_DELAY_HANDLING = 5,	// IDE didn't accept HandleBreakpoint request
} BP_ACTION;
					    
typedef enum tagBPSTATE {
    BPS_DELETED  = 0,
    BPS_DISABLED = 1,
    BPS_ENABLED  = 2,
    BPS_UNRESOLVED = 0x0100
} BPSTATE;
							

/* Listener status */
typedef enum tagListenerStatus {
	LSTNRS_ok = 0,
	LSTNRS_notinitialized,
	LSTNRS_stopped,
	LSTNRS_initerror
} ListenerStatus;

/* Listener log */
typedef enum tagListenerLogKind {
	LSTNRL_msg = 0,
	LSTNRL_warn,
	LSTNRL_error,
	LSTNRL_debugtrace
} ListenerLogKind;

/* Session flags */
const long	SOF_BREAKONLOAD		= 0x0001;
const long	SOF_BREAKONFINISH	= 0x0002;
const long	SOF_MATCHFILESINLOWCASE	= 0x0004;

const long	SOF_SEND_LOGS		= 0x0010;
const long	SOF_SEND_ERRORS		= 0x0020;
const long	SOF_SEND_OUTPUT		= 0x0040;
const long	SOF_SEND_OUTPUT_DETAILED	= 0x00080;

/* LT_type */
const long	LT_ODS			= 1;		/* OutputDebugString */
const long	LT_ERROR		= 2;		/* Error/Warning/Notice while executing */
const long	LT_OUTPUT		= 3;		/* Any echo(), print() or header() results */
const long	LT_FATALERROR		= 256;		/* Fatal error (currently if error occured while evaluating)*/

typedef enum tagSERVER_TYPE {
	SVR_AUTO	= 0x00,
	SVR_CGI		= 0x01,
	SVR_HTTP	= 0x02,
	SVR_HTTPS	= 0x03,
} SERVER_TYPE;

typedef enum tagDBGS_RESULT {	
	DBGSE_SUCCESSFULL			= 0,
	DBGSE_FAILED				= 0x1000,
	DBGSE_WRONGREQ				= 0x1001,
	DBGSE_FAILEDCREATETHREAD	= 0x1002,
	DBGSE_FAILEDCREATESOCKET	= 0x1003,
	DBGSE_FAILEDBINDSOCKET		= 0x1004,
	DBGSE_FAILEDLISTENSOCKET	= 0x1005,
	DBGSE_FAILEDCONNECTSOCKET	= 0x1006,
	DBGSE_FILENOTFOUND			= 0x1007,
	DBGSE_CGIHANDLERNOTFOUND	= 0x1008,
	DBGSE_HTTPHOSTNOTFOUND		= 0x1009,
	DBGSE_TIMEOUTSTARTSESS		= 0x100A,
	DBGSE_ASSIGNPIPE			= 0x100B,
} DBGS_RESULT;
								    
#endif
